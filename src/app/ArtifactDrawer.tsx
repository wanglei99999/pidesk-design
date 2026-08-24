import * as Dialog from "@radix-ui/react-dialog";
import { Download, FileText, X } from "lucide-react";

interface ArtifactDrawerProps {
	open: boolean;
	onOpenChange(open: boolean): void;
}

export function ArtifactDrawer({ open, onOpenChange }: ArtifactDrawerProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="artifact-overlay" />
				<Dialog.Content className="artifact-drawer">
					<header className="artifact-drawer-header">
						<div>
							<p>工作成果 · DOCX</p>
							<Dialog.Title>会议纪要草稿</Dialog.Title>
						</div>
						<div className="artifact-header-actions">
							<button aria-label="下载会议纪要草稿" className="icon-button" type="button">
								<Download aria-hidden="true" size={16} strokeWidth={1.5} />
							</button>
							<Dialog.Close asChild>
								<button aria-label="关闭成果预览" className="icon-button" type="button">
									<X aria-hidden="true" size={17} strokeWidth={1.5} />
								</button>
							</Dialog.Close>
						</div>
					</header>

					<Dialog.Description className="artifact-description">
						根据 6 份模拟会议材料生成，批准计划后可进入正式执行。
					</Dialog.Description>

					<div className="document-preview">
						<div className="document-page">
							<div className="document-label">
								<FileText aria-hidden="true" size={13} strokeWidth={1.5} />
								内部工作草稿
							</div>
							<h2>项目周会会议纪要</h2>
							<p className="document-date">2026年8月18日 · 总部第三会议室</p>
							<section>
								<h3>一、进展摘要</h3>
								<p>本周完成需求收敛和首轮资料盘点。前端原型进入设计验证阶段，运行时接入继续保持独立边界。</p>
							</section>
							<section>
								<h3>二、确认事项</h3>
								<ul>
									<li>首版使用本地 Web 形态，桌面封装后置。</li>
									<li>所有产生副作用的操作必须先形成计划并由用户确认。</li>
								</ul>
							</section>
							<section>
								<h3>三、下一步</h3>
								<table>
									<thead>
										<tr>
											<th>事项</th>
											<th>负责人</th>
											<th>时间</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>完成工作台原型评审</td>
											<td>王磊</td>
											<td>8月25日</td>
										</tr>
									</tbody>
								</table>
							</section>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
