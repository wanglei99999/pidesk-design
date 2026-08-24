# React Workbench Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a testable React prototype of the DeskBuddy Agent workbench using synthetic task data.

**Architecture:** A single Vite browser application owns transient prototype state. Focused React components render the workspace shell, task timeline, approval card, artifact drawer, and composer; no runtime or persistence boundary is introduced in this task.

**Tech Stack:** React 19.2.8, TypeScript 5.9.3, Vite 8.2.2, Tailwind CSS 4.3.3, Radix Dialog, Lucide React, Vitest 4.1.9, Testing Library, jsdom.

**Spec:** `tasks/TASK-002-react-workbench-prototype.md`

## Global Constraints

- Display the product name DeskBuddy; keep code and package naming as `pidesk`.
- Use only synthetic public data; do not call Pi, models, files, or company systems.
- Preserve the reference design's paper, desk, graphite, 4px rhythm, compact hierarchy, visible focus, and reduced-motion behavior.
- Use exact dependency versions and install with lifecycle scripts disabled.
- Test behavior before production implementation.

---

### Task 1: Frontend foundation and workbench shell

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`
- Create: `src/app/App.test.tsx`
- Create: `src/app/App.tsx`

**Interfaces:**
- Produces: `App(): JSX.Element`, the browser entry point and shared CSS design tokens.

- [x] Add the exact runtime and test dependencies with `npm install --ignore-scripts --save-exact`.
- [x] Add `dev`, `check`, and specific Vitest scripts without removing the SDK test script.
- [x] Write a failing test asserting that `App` exposes the DeskBuddy brand, “新建任务”, “工作区”, and task main region.
- [x] Run the specific test and confirm it fails because `App` does not exist.
- [x] Implement the minimum semantic shell and reference-derived design tokens.
- [x] Run the specific test and confirm it passes without warnings.

### Task 2: Welcome page and task navigation

**Files:**
- Create: `src/app/prototype-data.ts`
- Create: `src/app/Sidebar.tsx`
- Create: `src/app/WelcomeView.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `PrototypeTask`, `Workspace`, `TaskId` types and `Sidebar` selection callbacks.
- Consumes: the shared shell and CSS tokens from Task 1.

- [x] Add a failing test that starts on the welcome view and opens “整理项目周会材料” from the recent task list.
- [x] Confirm the failure is caused by missing navigation behavior.
- [x] Add immutable synthetic workspace/task data and state-driven selection.
- [x] Implement the compact sidebar and welcome intent cards.
- [x] Confirm navigation tests pass.

### Task 3: Task timeline, approval, artifact drawer, and composer

**Files:**
- Create: `src/app/TaskView.tsx`
- Create: `src/app/ApprovalCard.tsx`
- Create: `src/app/ArtifactDrawer.tsx`
- Create: `src/app/Composer.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `ApprovalDecision = "pending" | "approved" | "cancelled"`; `ArtifactDrawer` receives `open`, `onOpenChange`, and a synthetic artifact; `Composer` emits a trimmed non-empty message.
- Consumes: selected `PrototypeTask` and design tokens.

- [x] Add one failing test for approving the proposed file plan and observing “已批准”.
- [x] Add one failing test for opening and closing “会议纪要草稿” in the artifact drawer.
- [x] Add one failing test proving whitespace cannot be sent and a non-empty message appears in the timeline.
- [x] Confirm each test fails for the missing behavior before implementation.
- [x] Implement the smallest state transitions and accessible controls that satisfy the tests.
- [x] Run the component test after each behavior turns green.
- [x] Refactor duplicated button and status styles only while tests remain green.

### Task 4: Responsive and accessibility verification

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/App.test.tsx`
- Modify: `tasks/TASK-002-react-workbench-prototype.md`
- Modify: `TASKS.md`

**Interfaces:**
- Consumes: the complete prototype UI.
- Produces: verified responsive CSS and completed project records.

- [x] Add assertions for dialog naming, task-region naming, and keyboard-operable buttons.
- [x] Run the specific test and then `npm run check`.
- [x] Start Vite locally and inspect 1280px and 390px layouts in a browser.
- [x] Fix overflow, focus, contrast, or reduced-motion issues found during inspection without adding product scope.
- [x] Re-run the specific test and `npm run check` with clean output.
- [x] Record exact validation results, user-visible change, Git status, and the single next action.

## Self-Review

- Spec coverage: every acceptance criterion maps to Tasks 1–4.
- Placeholder scan: no implementation step depends on an undefined product decision.
- Type consistency: task selection, approval state, artifact drawer, and composer contracts are defined before use.
