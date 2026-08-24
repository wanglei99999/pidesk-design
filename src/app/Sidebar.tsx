import { ChevronDown, FolderOpen, SquarePen } from "lucide-react";
import type { PrototypeTask, TaskId, Workspace } from "./prototype-data";

interface SidebarProps {
	selectedTaskId: TaskId | null;
	tasks: readonly PrototypeTask[];
	workspaces: readonly Workspace[];
	onNewTask(): void;
	onSelectTask(taskId: TaskId): void;
}

export function Sidebar({ selectedTaskId, tasks, workspaces, onNewTask, onSelectTask }: SidebarProps) {
	return (
		<aside aria-label="主导航" className="sidebar">
			<header aria-label="DeskBuddy" className="brand">
				<span aria-hidden="true" className="brand-mark">
					D
				</span>
				<span className="brand-copy">
					<span className="brand-name">DeskBuddy</span>
					<span className="brand-subtitle">企业智能工作台</span>
				</span>
			</header>

			<button aria-label="新建任务" className="new-task-button" type="button" onClick={onNewTask}>
				<SquarePen aria-hidden="true" size={16} strokeWidth={1.5} />
				<span>新建任务</span>
				<span aria-hidden="true" className="new-task-shortcut">
					Ctrl N
				</span>
			</button>

			<nav aria-label="最近任务" className="recent-tasks">
				<h2 className="section-title">最近任务</h2>
				<div className="recent-task-list">
					{tasks.map((task) => (
						<button
							aria-current={selectedTaskId === task.id ? "page" : undefined}
							aria-label={task.title}
							className={selectedTaskId === task.id ? "recent-task is-active" : "recent-task"}
							key={task.id}
							type="button"
							onClick={() => onSelectTask(task.id)}
						>
							<span className="recent-task-title">{task.title}</span>
							<span className="recent-task-meta">
								<span>{task.status}</span>
								<time>{task.updatedAt}</time>
							</span>
						</button>
					))}
				</div>
			</nav>

			<section className="sidebar-section">
				<h2 className="section-title">工作区</h2>
				<div className="workspace-list">
					{workspaces.map((workspace, index) => (
						<button className={index === 0 ? "workspace-row is-active" : "workspace-row"} key={workspace.id} type="button">
							<FolderOpen aria-hidden="true" size={15} strokeWidth={1.5} />
							<span>{workspace.name}</span>
							<small>{workspace.fileCount}</small>
							{index === 0 ? <ChevronDown aria-hidden="true" size={13} strokeWidth={1.5} /> : null}
						</button>
					))}
				</div>
			</section>

			<footer className="sidebar-footer">
				<span className="user-avatar">王</span>
				<span className="user-copy">
					<strong>王磊</strong>
					<small>本地工作区</small>
				</span>
			</footer>
		</aside>
	);
}
