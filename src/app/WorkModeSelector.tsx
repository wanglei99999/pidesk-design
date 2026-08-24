import { BriefcaseBusiness, Code2 } from "lucide-react";

export type WorkMode = "office" | "code";

const workModes = [
	{ id: "office", icon: BriefcaseBusiness, label: "日常办公" },
	{ id: "code", icon: Code2, label: "代码开发" },
] as const;

interface WorkModeSelectorProps {
	onChange(mode: WorkMode): void;
	value: WorkMode;
}

export function WorkModeSelector({ onChange, value }: WorkModeSelectorProps) {
	return (
		<div aria-label="工作模式" className="work-mode-selector" role="group">
			{workModes.map((mode) => (
				<button
					aria-pressed={value === mode.id}
					className={value === mode.id ? "work-mode-button is-active" : "work-mode-button"}
					key={mode.id}
					type="button"
					onClick={() => onChange(mode.id)}
				>
					<mode.icon aria-hidden="true" size={15} strokeWidth={1.6} />
					{mode.label}
				</button>
			))}
		</div>
	);
}
