# Project Rules

These rules apply to the entire repository.

## Communication

- Keep explanations concise and technical.
- Answer questions before implementation commands.
- State agreement or disagreement before responding to feedback.
- Do not use emojis in technical content or GitHub activity.

## Context Loading

For every task, read only:

1. `TASKS.md`;
2. the current `tasks/TASK-NNN-*.md`;
3. files that will be changed, read in full unless a narrower rule is listed below.

Read other files only when needed:

- `README.md`: project scope is unclear or changed;
- `DEVELOPMENT.md`: creating, switching, handing off, or merging a task;
- current `scenarios/` file: implementing or reviewing that scenario;
- relevant `adr/` files: making or changing an architectural decision;
- only `[Unreleased]` in `CHANGELOG.md`: recording a user-visible change;
- market and source documents: selecting or comparing product scenarios;
- `templates/company-adaptation/`: only when explicitly adapting a completed scenario for a private environment.

Do not scan or load every document at task startup. Do not use chat history or local notes as the only project record.

## Development

- Require a task with scope and acceptance criteria before implementation.
- Start with the smallest complete scenario version.
- Keep the public product independent from private adapters.
- Use public information, synthetic data, and sanitized examples.
- Avoid abstractions not required by a current scenario.
- Inspect dependency types and official APIs instead of guessing.
- Do not remove intentional behavior to make checks pass without approval.
- Make risky operations previewable, confirmable, auditable, and recoverable.
- Use deterministic or fake model responses in automated tests; do not use paid model calls.

After code changes, run `npm run check`. When a test file is created or modified, run its specific test command and record the result in the current task. Automated Agent tests must use deterministic or fake providers, never paid model calls.

## Project Records

- Keep `TASKS.md` and the current task consistent.
- Record progress, validation, blockers, and one next action in the task file.
- Put product goals, scope, and priority in `product-decisions.md`.
- Create an ADR for decisions affecting multiple scenarios, security boundaries, or costly future changes.
- Replace accepted ADRs with new ADRs; do not rewrite their history.
- Record user-visible changes under `[Unreleased]` in `CHANGELOG.md`.
- Follow `07-learning-guide.md` and record verified lessons in the current task or a dedicated learning record.
- Add only repeated, verified practices to `06-development-rules.md`.

## Security

Never commit credentials, `.env` files, private keys, cookies, internal URLs, private schemas, real user or production data, or private absolute paths.

Private connectors, internal rules, credentials, and real data belong in an approved private environment. `.gitignore` is not a substitute for review.

## Git

- Keep `main` verified; use one `task/NNN-short-name` branch per task.
- Do not edit the same branch on multiple computers at the same time.
- Resume with fetch and fast-forward-only pull.
- Preserve unrelated changes and stage explicit paths only.
- Never use `git add .`, `git add -A`, destructive reset/clean, or force push.
- Do not commit or push unless the user explicitly asks.
- Before a requested commit, verify staged paths belong to the task.

Commit examples:

```text
feat(agent): add file organization preview
fix(agent): prevent target file overwrite
docs: record TASK-001 validation
```

## Handoff

Before stopping, update task progress, checks, blockers, ADR/Changelog needs, and one concrete next action. Check for sensitive or machine-specific content, report Git status, and commit or push only when explicitly requested.
