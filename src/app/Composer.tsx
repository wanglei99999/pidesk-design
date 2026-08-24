import { ArrowUp, AtSign, Folder, Paperclip } from "lucide-react";
import { useState } from "react";

interface ComposerProps {
	ariaLabel?: string;
	autoFocus?: boolean;
	onSend(message: string): void;
	placeholder?: string;
	variant?: "start" | "task";
	workspaceLabel?: string;
}

export function Composer({
	ariaLabel = "描述后续任务",
	autoFocus = false,
	onSend,
	placeholder = "描述后续任务，或继续修改当前成果…",
	variant = "task",
	workspaceLabel,
}: ComposerProps) {
	const [draft, setDraft] = useState("");
	const canSend = draft.trim().length > 0;

	return (
		<form
			className={variant === "start" ? "composer-wrap is-start" : "composer-wrap"}
			onSubmit={(event) => {
				event.preventDefault();
				const message = draft.trim();
				if (!message) return;
				onSend(message);
				setDraft("");
			}}
		>
			<div className="composer">
				{workspaceLabel ? (
					<div className="composer-context">
						<Folder aria-hidden="true" size={14} strokeWidth={1.5} />
						<span>{workspaceLabel}</span>
					</div>
				) : null}
				<textarea
					aria-label={ariaLabel}
					autoFocus={autoFocus}
					placeholder={placeholder}
					rows={2}
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
							event.preventDefault();
							event.currentTarget.form?.requestSubmit();
						}
					}}
				/>
				<div className="composer-tools">
					<div>
						<button aria-label="添加附件" className="composer-tool-button" type="button">
							<Paperclip aria-hidden="true" size={16} strokeWidth={1.5} />
						</button>
						<button aria-label="引用工作区内容" className="composer-tool-button" type="button">
							<AtSign aria-hidden="true" size={16} strokeWidth={1.5} />
						</button>
					</div>
					<span>Enter 发送 · Shift Enter 换行</span>
					<button aria-label="发送消息" className="send-button" disabled={!canSend} type="submit">
						<ArrowUp aria-hidden="true" size={16} strokeWidth={1.7} />
					</button>
				</div>
			</div>
		</form>
	);
}
