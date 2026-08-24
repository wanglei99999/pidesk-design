import { CheckCircle2, Clock3, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import { ApprovalCard, type ApprovalDecision } from "./ApprovalCard";
import { ArtifactDrawer } from "./ArtifactDrawer";
import { Composer } from "./Composer";
import type { PrototypeTask } from "./prototype-data";

interface TaskViewProps {
	task: PrototypeTask;
}

export function TaskView({ task }: TaskViewProps) {
	const isLocalTask = task.source === "local";
	const [approvalDecision, setApprovalDecision] = useState<ApprovalDecision>("pending");
	const [artifactOpen, setArtifactOpen] = useState(false);
	const [followUps, setFollowUps] = useState<readonly string[]>([]);

	return (
		<div className="task-view">
			<div className="task-header">
				<div>
					<p className="task-eyebrow">总部办公资料 / 任务</p>
					<h1>{task.title}</h1>
					<p>{task.summary}</p>
				</div>
				<span className="task-status">
					<Clock3 aria-hidden="true" size={14} strokeWidth={1.5} />
					{task.status}
				</span>
			</div>
			<div className="task-stream">
				<article className="timeline-entry user-entry">
					<div className="timeline-marker">王</div>
					<div>
						<p className="entry-meta">你 · 10:24</p>
						<p>{isLocalTask ? task.prompt : "请整理本周项目会议材料，提取需要确认的事项，并生成一份会议纪要草稿。"}</p>
					</div>
				</article>
				<article className="timeline-entry agent-entry">
					<div className="timeline-marker agent-mark">D</div>
					<div>
						<p className="entry-meta">DeskBuddy · 刚刚</p>
						<p>
							{isLocalTask
								? "任务已创建，DeskBuddy 已建立本地任务上下文。"
								: "我已读取工作区中的 6 份会议材料，正在建立议题、决定和待办之间的对应关系。"}
						</p>
						<div className="inline-progress">
							<CheckCircle2 aria-hidden="true" size={15} strokeWidth={1.5} />
							{isLocalTask ? "已建立任务上下文" : "已完成材料分析"}
						</div>
					</div>
				</article>
				{isLocalTask ? null : (
					<>
						<div className="timeline-offset">
							<ApprovalCard decision={approvalDecision} onDecision={setApprovalDecision} />
						</div>
						<div className="timeline-offset artifact-section">
							<p className="artifact-section-label">工作成果</p>
							<button
								aria-label="预览会议纪要草稿"
								className="artifact-card"
								type="button"
								onClick={() => setArtifactOpen(true)}
							>
								<span className="artifact-file-icon">
									<FileText aria-hidden="true" size={18} strokeWidth={1.5} />
								</span>
								<span className="artifact-copy">
									<strong>会议纪要草稿</strong>
									<small>DOCX · 3 页 · 刚刚生成</small>
								</span>
								<span className="artifact-open-label">
									<ExternalLink aria-hidden="true" size={13} strokeWidth={1.5} />
									预览
								</span>
							</button>
						</div>
					</>
				)}
				{followUps.map((message, index) => (
					<article className="timeline-entry user-entry follow-up-entry" key={`${index}:${message}`}>
						<div className="timeline-marker">王</div>
						<div>
							<p className="entry-meta">你 · 刚刚</p>
							<p>{message}</p>
						</div>
					</article>
				))}
			</div>
			<Composer onSend={(message) => setFollowUps((current) => [...current, message])} />
			<ArtifactDrawer open={artifactOpen} onOpenChange={setArtifactOpen} />
		</div>
	);
}
