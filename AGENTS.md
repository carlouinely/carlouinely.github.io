## Toolchain: `vp`

Use `vp` for everything (`vp help`; docs in `node_modules/vite-plus/docs`).

- Deps: `vp install` / `add` / `remove`; binaries: `vp exec <bin>` (local), `vp dlx <pkg>` (one-off).
- `vp` built-ins shadow same-named scripts, so `vp build` skips this repo's `tsc`; run project scripts with `vp run <name>`.
- Trouble: `vp env doctor` (include its output), `vp toolchain [tool]`, `vp why <pkg>`.

**Done means `vp check` and `vp build` both pass** — `vp build` catches the client/server boundary `vp check` misses.

## Code

Self-documenting: names and structure carry meaning; comment only the non-obvious _why_.

## Design

[`DESIGN.md`](./DESIGN.md) governs all visual work: read it before touching UI. `src/styles.css` mirrors its tokens as the Tailwind theme — change both together.

## Deploy

Prerendered to `dist/client`: every route must be linkable from `/` or listed in `tanstackStart({ pages })`.

## Commits

Conventional Commits `<type>(<scope>): <subject>`; `vp check --fix` runs on staged files. Commit directly to `main` — `/implement` never branches. When implementing a ticket, add `Closes #<n>` to the commit body; the push to `main` closes the issue.

## Agent skills

- **Issue tracker** — GitHub issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.
- **Triage labels** — five triage roles mapped to this repo's labels. See `docs/agents/triage-labels.md`.
- **Domain docs** — single-context: `GLOSSARY.md` and `docs/adr/` at the root. See `docs/agents/domain.md`.
