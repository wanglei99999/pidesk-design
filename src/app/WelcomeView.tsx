import {
	BookOpenCheck,
	Bug,
	Code2,
	FileChartColumn,
	FileText,
	FolderKanban,
	ListChecks,
	TestTube2,
} from "lucide-react";
import { useState } from "react";
import { Composer } from "./Composer";
import { WorkModeSelector, type WorkMode } from "./WorkModeSelector";

const officeIntents = [
	{
		icon: FolderKanban,
		label: "整理一批材料",
		description: "识别内容、归类并生成处理计划",
		prompt: "整理一批材料",
	},
	{
		icon: FileText,
		label: "起草一份文档",
		description: "根据工作区资料形成可继续修改的草稿",
		prompt: "起草一份文档",
	},
	{
		icon: FileChartColumn,
		label: "分析一张表格",
		description: "发现异常、归纳结论并准备汇报要点",
		prompt: "分析一张表格",
	},
	{
		icon: ListChecks,
		label: "梳理任务进展",
		description: "从会议和材料中提取负责人及下一步",
		prompt: "梳理任务进展",
	},
] as const;

const codeIntents = [
	{
		icon: BookOpenCheck,
		label: "理解一个代码库",
		description: "梳理项目结构、关键模块和运行方式",
		prompt: "帮我理解这个代码库的结构和主要模块",
	},
	{
		icon: Code2,
		label: "实现一个功能",
		description: "分析现有实现并完成一项明确改动",
		prompt: "帮我在当前项目中实现一个功能",
	},
	{
		icon: Bug,
		label: "排查一个问题",
		description: "定位原因、验证判断并给出修复方案",
		prompt: "帮我排查当前项目中的一个问题",
	},
	{
		icon: TestTube2,
		label: "补充自动化测试",
		description: "识别缺口并为关键行为补充测试",
		prompt: "帮我为当前项目补充自动化测试",
	},
] as const;

interface WelcomeViewProps {
	onCreateTask(message: string): void;
	onStartTask(): void;
	workspaceName: string;
}

export function WelcomeView({ onCreateTask, onStartTask, workspaceName }: WelcomeViewProps) {
	const [mode, setMode] = useState<WorkMode>("office");
	const isCodeMode = mode === "code";
	const intents = isCodeMode ? codeIntents : officeIntents;

	return (
		<div className="welcome-view">
			<div className="welcome-center">
				<div className="welcome-kicker">
					<span className="status-dot" />
					工作台已就绪
				</div>
				<h1>{isCodeMode ? "想在代码仓库中完成什么？" : `想在${workspaceName}中完成什么？`}</h1>
				<p className="welcome-lead">
					{isCodeMode
						? "选择代码仓库并描述目标，DeskBuddy 会阅读项目上下文，形成可检查的开发结果。"
						: "描述目标，DeskBuddy 会结合工作区材料形成可检查、可确认的工作成果。"}
				</p>
				<WorkModeSelector value={mode} onChange={setMode} />
				<div className="intent-grid">
					{intents.map((intent) => (
						<button
							aria-label={intent.label}
							className="intent-card"
							key={intent.label}
							type="button"
							onClick={() => (isCodeMode ? onCreateTask(intent.prompt) : onStartTask())}
						>
							<intent.icon aria-hidden="true" size={19} strokeWidth={1.45} />
							<strong>{intent.label}</strong>
							<span>{intent.description}</span>
						</button>
					))}
				</div>
			</div>
			<Composer
				ariaLabel="描述新任务"
				autoFocus
				placeholder={isCodeMode ? "描述代码开发任务…" : "描述你想完成的工作…"}
				variant="start"
				workspaceLabel={isCodeMode ? "选择代码仓库" : workspaceName}
				onSend={onCreateTask}
			/>
		</div>
	);
}
