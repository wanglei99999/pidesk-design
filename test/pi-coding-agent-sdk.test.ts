import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { InMemoryCredentialStore } from "@earendil-works/pi-ai";
import {
	fauxAssistantMessage,
	fauxProvider,
	fauxToolCall,
	type FauxProviderHandle,
} from "@earendil-works/pi-ai/providers/faux";
import {
	type AgentSession,
	type AgentSessionEvent,
	createAgentSession,
	DefaultResourceLoader,
	defineTool,
	ModelRuntime,
	SessionManager,
	SettingsManager,
	type ToolDefinition,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { describe, expect, it } from "vitest";

const PIDESK_SYSTEM_PROMPT = "You are the PiDesk runtime. Use only the tools explicitly provided by PiDesk.";

interface SdkHarness {
	session: AgentSession;
	faux: FauxProviderHandle;
	events: AgentSessionEvent[];
	cleanup(): void;
}

async function createSdkHarness(customTools: ToolDefinition[]): Promise<SdkHarness> {
	const cwd = mkdtempSync(join(tmpdir(), "pidesk-sdk-"));
	const agentDir = join(cwd, "agent");
	const faux = fauxProvider();

	try {
		const modelRuntime = await ModelRuntime.create({
			credentials: new InMemoryCredentialStore(),
			modelsPath: null,
			allowModelNetwork: false,
		});
		modelRuntime.registerProvider(faux.provider.id, {
			name: faux.provider.name,
			api: faux.api,
			apiKey: "faux-key",
			streamSimple: (model, context, options) => faux.provider.streamSimple(model, context, options),
			models: faux.models.map((model) => ({
				id: model.id,
				name: model.name,
				api: model.api,
				baseUrl: model.baseUrl,
				reasoning: model.reasoning,
				input: [...model.input],
				cost: model.cost,
				contextWindow: model.contextWindow,
				maxTokens: model.maxTokens,
			})),
		});
		await modelRuntime.refresh({ allowNetwork: false });
		const model = modelRuntime.getModel(faux.provider.id, faux.getModel().id);
		if (!model) {
			throw new Error("Faux model was not registered.");
		}

		const settingsManager = SettingsManager.inMemory({
			compaction: { enabled: false },
			retry: { enabled: false },
		});
		const resourceLoader = new DefaultResourceLoader({
			cwd,
			agentDir,
			settingsManager,
			noExtensions: true,
			noSkills: true,
			noPromptTemplates: true,
			noThemes: true,
			noContextFiles: true,
			systemPromptOverride: () => PIDESK_SYSTEM_PROMPT,
		});
		await resourceLoader.reload();

		const { session } = await createAgentSession({
			cwd,
			agentDir,
			modelRuntime,
			model,
			tools: customTools.map((tool) => tool.name),
			customTools,
			resourceLoader,
			sessionManager: SessionManager.inMemory(cwd),
			settingsManager,
		});
		const events: AgentSessionEvent[] = [];
		session.subscribe((event) => {
			events.push(event);
		});

		return {
			session,
			faux,
			events,
			cleanup() {
				session.dispose();
				rmSync(cwd, { recursive: true, force: true });
			},
		};
	} catch (error) {
		rmSync(cwd, { recursive: true, force: true });
		throw error;
	}
}

describe("pi-coding-agent SDK boundary", () => {
	it("uses the PiDesk prompt, exposes only PiDesk tools, and emits observable lifecycle events", async () => {
		const invocations: Array<{ workspaceId: string }> = [];
		let observedSystemPrompt = "";
		let observedToolNames: string[] = [];
		const inspectWorkspace = defineTool({
			name: "inspect_workspace",
			label: "Inspect workspace",
			description: "Return synthetic workspace metadata.",
			parameters: Type.Object({
				workspaceId: Type.String(),
			}),
			execute: async (_toolCallId, params) => {
				invocations.push(params);
				return {
					content: [{ type: "text", text: "Synthetic workspace inspected." }],
					details: { files: ["meeting-notes.md"] },
				};
			},
		});
		const harness = await createSdkHarness([inspectWorkspace]);

		try {
			harness.faux.setResponses([
				(context) => {
					observedSystemPrompt = context.systemPrompt ?? "";
					observedToolNames = context.tools?.map((tool) => tool.name) ?? [];
					return fauxAssistantMessage(
						fauxToolCall("inspect_workspace", { workspaceId: "workspace-demo" }),
						{ stopReason: "toolUse" },
					);
				},
				fauxAssistantMessage("Workspace analysis complete."),
			]);

			await harness.session.prompt("Inspect the synthetic workspace.");

			expect(observedSystemPrompt).toContain(PIDESK_SYSTEM_PROMPT);
			expect(observedSystemPrompt).not.toContain("You are an expert coding assistant");
			expect(observedToolNames).toEqual(["inspect_workspace"]);
			expect(invocations).toEqual([{ workspaceId: "workspace-demo" }]);
			expect(harness.events.map((event) => event.type)).toEqual(
				expect.arrayContaining([
					"agent_start",
					"message_update",
					"tool_execution_start",
					"tool_execution_end",
					"agent_end",
					"agent_settled",
				]),
			);
			expect(harness.session.sessionFile).toBeUndefined();
			expect(harness.session.isStreaming).toBe(false);
			expect(harness.faux.getPendingResponseCount()).toBe(0);
		} finally {
			harness.cleanup();
		}
	});

	it("propagates abort to an active custom tool and settles the session", async () => {
		let resolveToolStarted: (() => void) | undefined;
		const toolStarted = new Promise<void>((resolve) => {
			resolveToolStarted = resolve;
		});
		let toolObservedAbort = false;
		const waitForAbort = defineTool({
			name: "wait_for_abort",
			label: "Wait for abort",
			description: "Wait until the host cancels the current run.",
			parameters: Type.Object({}),
			execute: async (_toolCallId, _params, signal) => {
				if (!signal) {
					throw new Error("Expected an AbortSignal.");
				}
				resolveToolStarted?.();
				await new Promise<void>((resolve) => {
					if (signal.aborted) {
						resolve();
						return;
					}
					signal.addEventListener("abort", () => resolve(), { once: true });
				});
				toolObservedAbort = signal.aborted;
				return {
					content: [{ type: "text", text: "Host cancellation observed." }],
					details: { aborted: toolObservedAbort },
				};
			},
		});
		const harness = await createSdkHarness([waitForAbort]);

		try {
			harness.faux.setResponses([
				fauxAssistantMessage(fauxToolCall("wait_for_abort", {}), {
					stopReason: "toolUse",
				}),
			]);

			const prompt = harness.session.prompt("Start a cancellable synthetic task.");
			await toolStarted;
			await harness.session.abort();
			await prompt;

			expect(toolObservedAbort).toBe(true);
			expect(harness.session.isStreaming).toBe(false);
			expect(harness.events.some((event) => event.type === "agent_settled")).toBe(true);
			expect(harness.events.filter((event) => event.type === "tool_execution_start")).toHaveLength(1);
			expect(harness.faux.getPendingResponseCount()).toBe(0);
		} finally {
			harness.cleanup();
		}
	});
});
