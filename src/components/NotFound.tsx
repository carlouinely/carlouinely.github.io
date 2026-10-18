import { ArrowGlyph } from '~src/components/glyphs'

/**
 * The Not Found page, shared by the catch-all route and the router's default
 * not-found boundary, so an unknown URL and an unknown Case Study slug land on
 * the same page. The display `404` carries the page the way the display type
 * carries every other page here; under the dotted rule sit the line that
 * explains what happened and the two ways back a lost visitor needs.
 */
export function NotFound() {
  return (
    <main className="page-shell page-block">
      <h1 className="font-pp-neue-corp-compact text-heading-2xl font-regular tracking-heading text-obsidian uppercase md:text-display">
        <span aria-hidden="true">404</span>
        <span className="sr-only">Page not found</span>
      </h1>

      <div className="page-head border-t-[1.5px] border-dotted border-obsidian pt-24 md:pt-32">
        <p className="max-w-[var(--measure-prose)] font-dm-sans text-body text-obsidian md:text-body-lg">
          That page is not here. It may have moved, or the link that brought you here was wrong.
        </p>

        <div className="page-gap flex flex-wrap items-center gap-16">
          <a
            href="/"
            className="action-pill action-pill--primary w-full justify-center gap-8 sm:w-auto"
          >
            Back to home
            <ArrowGlyph className="arrow-nudge" />
          </a>
          <a
            href="/projects"
            className="action-pill action-pill--quiet w-full justify-center gap-8 sm:w-auto"
          >
            See the projects
          </a>
        </div>
      </div>
    </main>
  )
}
