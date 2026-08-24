import { Check, FileText, ShieldCheck, X } from "lucide-react";

export type ApprovalDecision = "pending" | "approved" | "cancelled";

interface ApprovalCardProps {
	decision: ApprovalDecision;
	onDecision(decision: Exclude<ApprovalDecision, "pending">): void;
}

const plannedChanges = [
	{ source: "项目周会记录-0818.docx", result: "项目周会纪要_2026-08-18.docx" },
	{ source: "待办汇总.xlsx", result: "项目周会待办清单_2026-08-18.xlsx" },
] as const;

export function ApprovalCard({ decision, onDecision }: ApprovalCardProps) {
	return (
		<section aria-labelledby="approval-title" className={`approval-card is-${decision}`}>
			<div className="approval-heading">
				<span className="approval-icon">
					<ShieldCheck aria-hidden="true" size={17} strokeWidth={1.5} />
				</span>
				<div>
					<p className="approval-kicker">需要你的确认</p>
					<h2 id="approval-title">待确认操作</h2>
				</div>
				{decision !== "pending" ? (
					<span aria-live="polite" className="decision-badge">
						{decision === "approved" ? "已批准" : "已取消"}
					</span>
				) : null}
			</div>

			<p className="approval-description">将生成会议纪要和待办清单。当前只展示模拟计划，不会修改真实文件。</p>

			<div className="change-list">
				{plannedChanges.map((change) => (
					<div className="change-row" key={change.source}>
						<FileText aria-hidden="true" size={15} strokeWidth={1.5} />
						<span>{change.source}</span>
						<span aria-hidden="true" className="change-arrow">
							→
						</span>
						<strong>{change.result}</strong>
					</div>
				))}
			</div>

			{decision === "pending" ? (
				<div className="approval-actions">
					<button className="secondary-button" type="button" onClick={() => onDecision("cancelled")}>
						<X aria-hidden="true" size={14} strokeWidth={1.5} />
						取消
					</button>
					<button className="primary-button" type="button" onClick={() => onDecision("approved")}>
						<Check aria-hidden="true" size={14} strokeWidth={1.7} />
						批准执行
					</button>
				</div>
			) : null}
		</section>
	);
}
