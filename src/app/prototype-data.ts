export type TaskId = string;

export interface Workspace {
	id: string;
	name: string;
	fileCount: number;
}

interface TaskBase {
	id: TaskId;
	title: string;
	summary: string;
	updatedAt: string;
	status: "待确认" | "处理中" | "已完成";
}

export interface DemoTask extends TaskBase {
	source: "prototype";
}

export interface LocalTask extends TaskBase {
	prompt: string;
	source: "local";
}

export type PrototypeTask = DemoTask | LocalTask;

export const workspaces: readonly Workspace[] = [
	{ id: "headquarters", name: "总部办公资料", fileCount: 24 },
	{ id: "operations", name: "经营分析", fileCount: 11 },
];

export const prototypeTasks: readonly PrototypeTask[] = [
	{
		id: "weekly-meeting",
		source: "prototype",
		title: "整理项目周会材料",
		summary: "汇总议题、识别待办并生成会议纪要草稿",
		updatedAt: "刚刚",
		status: "待确认",
	},
	{
		id: "policy-summary",
		source: "prototype",
		title: "提炼制度修订要点",
		summary: "比较两个版本并标记影响范围",
		updatedAt: "昨天",
		status: "已完成",
	},
	{
		id: "report-outline",
		source: "prototype",
		title: "生成经营分析提纲",
		summary: "根据月度数据表建立汇报结构",
		updatedAt: "8月21日",
		status: "处理中",
	},
];
