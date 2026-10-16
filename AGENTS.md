## Toolchain: `vp`

Use `vp` for everything; it wraps pnpm, Vite, Vitest, oxlint, oxfmt, tsdown (`vp help`; docs: `node_modules/vite-plus/docs`).

- Deps: `vp install` / `vp add` / `vp remove`. Binaries: `vp exec <bin>` (local), `vp dlx <pkg>` (one-off).
- `vp` built-ins shadow same-named scripts, so `vp build` skips this repo's `tsc`; run project scripts with `vp run <name>`.

## Definition of done

`vp check` and `vp build` must both pass before you report a change finished; `vp build` catches the client/server boundary `vp check` misses.

## Troubleshooting

Setup, runtime or install trouble: `vp env doctor` (include its output), `vp toolchain [tool]`, `vp why <pkg>`.

## Code

Self-documenting: names and structure carry the meaning. Comment only the non-obvious _why_.

## Design

[`DESIGN.md`](./DESIGN.md) governs all visual work: read it before touching UI and build from its tokens and rules. `src/styles.css` mirrors those tokens as the Tailwind v4 theme; change both together.

## Deploy

Prerendered to `dist/client`: every route must be linkable from `/` or listed in `tanstackStart({ pages })`.

## Commits

Every commit: Conventional Commits `<type>(<scope>): <subject>`. Hook: `vp check --fix` on staged files.
