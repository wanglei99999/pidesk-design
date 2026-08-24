import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("DeskBuddy workbench", () => {
	it("presents the DeskBuddy product shell and primary task actions", () => {
		render(<App />);

		expect(screen.getByRole("banner", { name: "DeskBuddy" })).toHaveTextContent("DeskBuddy");
		expect(screen.getByText(/DeskBuddy 会结合工作区材料/)).toBeInTheDocument();
		expect(screen.getByRole("complementary", { name: "主导航" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "新建任务" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "工作区" })).toBeInTheDocument();
		expect(screen.getByRole("main", { name: "任务工作区" })).toBeInTheDocument();
	});

	it("places recent tasks before persistent workspaces in the sidebar reading order", () => {
		render(<App />);
		const sidebar = screen.getByRole("complementary", { name: "主导航" });
		const recentTasks = within(sidebar).getByRole("navigation", { name: "最近任务" });
		const workspaceHeading = within(sidebar).getByRole("heading", { name: "工作区" });

		expect(recentTasks.compareDocumentPosition(workspaceHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it("switches the new task experience between office and code development", async () => {
		const user = userEvent.setup();
		render(<App />);

		const modeSelector = screen.getByRole("group", { name: "工作模式" });
		const officeMode = screen.getByRole("button", { name: "日常办公" });
		const codeMode = screen.getByRole("button", { name: "代码开发" });

		expect(modeSelector).toBeInTheDocument();
		expect(officeMode).toHaveAttribute("aria-pressed", "true");
		expect(codeMode).toHaveAttribute("aria-pressed", "false");

		await user.click(codeMode);

		expect(codeMode).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByRole("heading", { name: "想在代码仓库中完成什么？" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "理解一个代码库" })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "描述新任务" })).toHaveAttribute(
			"placeholder",
			"描述代码开发任务…",
		);
		expect(screen.getByText("选择代码仓库")).toBeInTheDocument();
	});

	it("opens a recent task from the welcome view", async () => {
		const user = userEvent.setup();
		render(<App />);

		expect(screen.getByRole("heading", { name: "想在总部办公资料中完成什么？" })).toBeInTheDocument();
		const recentTasks = screen.getByRole("navigation", { name: "最近任务" });
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));

		expect(recentTasks).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "整理项目周会材料" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "新建任务" }));
		expect(screen.getByRole("heading", { name: "想在总部办公资料中完成什么？" })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "描述新任务" })).toHaveFocus();
	});

	it("opens a fresh task composer with Ctrl+N", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));

		await user.keyboard("{Control>}n{/Control}");

		expect(screen.getByRole("heading", { name: "想在总部办公资料中完成什么？" })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "描述新任务" })).toHaveFocus();
	});

	it("creates a local conversation from the first task message", async () => {
		const user = userEvent.setup();
		render(<App />);
		const composer = screen.getByRole("textbox", { name: "描述新任务" });

		await user.type(composer, "起草季度经营分析");
		await user.click(screen.getByRole("button", { name: "发送消息" }));

		expect(screen.getByRole("heading", { name: "起草季度经营分析" })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "最近任务" })).toHaveTextContent("起草季度经营分析");
		expect(screen.getByText("任务已创建，DeskBuddy 已建立本地任务上下文。")).toBeInTheDocument();
		expect(screen.queryByRole("heading", { name: "待确认操作" })).not.toBeInTheDocument();
	});

	it("starts the synthetic material task from a welcome intent", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole("button", { name: "整理一批材料" }));

		expect(screen.getByRole("heading", { name: "整理项目周会材料" })).toBeInTheDocument();
	});

	it("records approval of the proposed file plan", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));

		expect(screen.getByRole("heading", { name: "待确认操作" })).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "批准执行" }));

		expect(screen.getByText("已批准")).toBeInTheDocument();
	});

	it("records cancellation without approving the proposed file plan", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));

		await user.click(screen.getByRole("button", { name: "取消" }));

		expect(screen.getByText("已取消")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "批准执行" })).not.toBeInTheDocument();
	});

	it("does not carry approval state into another task", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));
		await user.click(screen.getByRole("button", { name: "批准执行" }));

		await user.click(screen.getByRole("button", { name: "提炼制度修订要点" }));

		expect(screen.queryByText("已批准")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "批准执行" })).toBeInTheDocument();
	});

	it("opens and closes the meeting notes artifact", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));

		await user.click(screen.getByRole("button", { name: "预览会议纪要草稿" }));
		expect(screen.getByRole("dialog", { name: "会议纪要草稿" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "关闭成果预览" }));
		expect(screen.queryByRole("dialog", { name: "会议纪要草稿" })).not.toBeInTheDocument();
	});

	it("sends a trimmed follow-up and rejects whitespace-only input", async () => {
		const user = userEvent.setup();
		render(<App />);
		await user.click(screen.getByRole("button", { name: "整理项目周会材料" }));

		const composer = screen.getByRole("textbox", { name: "描述后续任务" });
		const send = screen.getByRole("button", { name: "发送消息" });
		await user.type(composer, "   ");
		expect(send).toBeDisabled();

		await user.clear(composer);
		await user.type(composer, "  请补充项目风险  ");
		await user.click(send);

		expect(screen.getByText("请补充项目风险")).toBeInTheDocument();
		expect(composer).toHaveValue("");
	});
});
