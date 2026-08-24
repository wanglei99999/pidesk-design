import { useCallback, useEffect, useRef, useState } from "react";
import { prototypeTasks, type PrototypeTask, type TaskId, workspaces } from "./prototype-data";
import { Sidebar } from "./Sidebar";
import { TaskView } from "./TaskView";
import { WelcomeView } from "./WelcomeView";

export function App() {
	const [tasks, setTasks] = useState<readonly PrototypeTask[]>(prototypeTasks);
	const [selectedTaskId, setSelectedTaskId] = useState<TaskId | null>(null);
	const [newTaskRevision, setNewTaskRevision] = useState(0);
	const localTaskSequence = useRef(0);
	const selectedTask = tasks.find((task) => task.id === selectedTaskId);
	const primaryWorkspace = workspaces[0];

	if (!primaryWorkspace) {
		throw new Error("DeskBuddy requires at least one workspace.");
	}

	const openNewTask = useCallback(() => {
		setSelectedTaskId(null);
		setNewTaskRevision((current) => current + 1);
	}, []);

	useEffect(() => {
		const handleNewTaskShortcut = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key.toLowerCase() === "n") {
				event.preventDefault();
				openNewTask();
			}
		};

		window.addEventListener("keydown", handleNewTaskShortcut);
		return () => window.removeEventListener("keydown", handleNewTaskShortcut);
	}, [openNewTask]);

	const createLocalTask = (prompt: string) => {
		localTaskSequence.current += 1;
		const title = prompt.length > 22 ? `${prompt.slice(0, 22)}…` : prompt;
		const task: PrototypeTask = {
			id: `local-${localTaskSequence.current}`,
			prompt,
			source: "local",
			status: "处理中",
			summary: "新建任务 · 本地模拟执行",
			title,
			updatedAt: "刚刚",
		};

		setTasks((current) => [task, ...current]);
		setSelectedTaskId(task.id);
	};

	return (
		<div className="workbench">
			<Sidebar
				selectedTaskId={selectedTaskId}
				tasks={tasks}
				workspaces={workspaces}
				onNewTask={openNewTask}
				onSelectTask={setSelectedTaskId}
			/>

			<section className="paper-shell">
				<main aria-label="任务工作区" className="task-main">
					{selectedTask ? (
						<TaskView key={selectedTask.id} task={selectedTask} />
					) : (
						<WelcomeView
							key={newTaskRevision}
							workspaceName={primaryWorkspace.name}
							onCreateTask={createLocalTask}
							onStartTask={() => setSelectedTaskId("weekly-meeting")}
						/>
					)}
				</main>
			</section>
		</div>
	);
}
