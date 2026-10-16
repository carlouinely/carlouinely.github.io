# Projects

One `.mdx` file per Project. The filename is the Case Study slug:
`projects/darkroom-system.mdx` renders at `/projects/darkroom-system`.

Files whose name begins with `_` are skipped by the loader, so use that prefix
for templates and drafts. Copy `_template.mdx` to start a new Project.

Frontmatter is the single source of truth for the home page card and the Case
Study header.

| Field       | Required | Default | Notes                                             |
| ----------- | -------- | ------- | ------------------------------------------------- |
| `title`     | yes      | —       | Card and Case Study heading                       |
| `summary`   | yes      | —       | One-line outcome, used on both surfaces           |
| `tag`       | yes      | —       | Category label (for example `Web App`)            |
| `year`      | yes      | —       | Number                                            |
| `order`     | yes      | —       | Number; ascending order on the home page          |
| `highlight` | no       | `false` | Marks the Project as a Highlight                  |
| `thumbnail` | no       | `null`  | Absent means the card uses a Placeholder          |
| `stack`     | no       | `[]`    | Technology names                                  |
| `repo`      | no       | `null`  | Source URL; absent means no source link           |
| `credit`    | no       | `null`  | Client or collaborator credited on the Case Study |

The loader in `src/content/projects.ts` validates required fields and fails the
build with the offending file and field named. The MDX body is compiled by
`@mdx-js/rollup`; an unparseable body fails the build too.

## Media in a body

Place media in the body where it is relevant rather than in a fixed slot:

```mdx
<Media kind="image" ratio="16 / 9" label="WILDFIRE dashboard screenshot" />
```

The Case Study route supplies `Media`, so a body never imports it. With no `src`
it renders a labelled Placeholder; adding a `src` swaps in the real asset. Keep
the asset listed in `PLACEHOLDERS.md` while it is still a Placeholder.
