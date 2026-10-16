## Toolchain: `vp`

Use `vp` for everything — it wraps pnpm, Vite, Vitest, oxlint, oxfmt and tsdown (`vp help`; docs in `node_modules/vite-plus/docs`).

- Deps: `vp install` / `vp add` / `vp remove`. Binaries: `vp exec <bin>` (local), `vp dlx <pkg>` (one-off).
- Built-ins beat same-named scripts, so `vp build` skips this repo's `tsc` — run project scripts with `vp run <name>`.

## Workflow

1. `vp check` and `vp build` must both pass before you report a change finished — `vp build` alone catches the client/server boundary that `vp check` misses.

## Troubleshooting

Setup, runtime or install misbehaving: `vp env doctor` (include its output), `vp toolchain [tool]`, `vp why <pkg>`.

## Code

Self-documenting: names and structure carry the meaning. Comment only the non-obvious _why_.

## Deploy

Prerendered to `dist/client`: every route must be linkable from `/` or listed in `tanstackStart({ pages })`.

## Commits

Every commit: Conventional Commits `<type>(<scope>): <subject>`. Pre-commit hook: `vp check --fix` on staged files.
