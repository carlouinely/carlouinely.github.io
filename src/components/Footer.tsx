import { MountainGlyph } from '~src/components/glyphs'
import { contact } from '~src/content/contact'
import { site } from '~src/site'

/**
 * The site's one closing block, and its only dark surface. Two groups: the ask
 * with the address it offers, then the identity row under a dotted rule.
 *
 * The address is the block's only action, because contact is what the last
 * screen of the page is for. The CV action already rides in the nav on every
 * surface and beside the hero, so a second copy here put a disabled control in
 * the one place a visitor is ready to write, and made it the loudest thing in
 * the band.
 *
 * Its ask row is the same row the home sections open with: a heading on the
 * gutter with the line that supports it, and the action on the opposite edge,
 * at the same heading size and the same gaps as "Things I've built". The
 * identity row spans the rule the way the nav pill and the hero rail span
 * theirs, with the wordmark on the gutter and the copyright on the far edge, so
 * the rule has weight at both ends.
 *
 * There is no site map here. The nav already carries every section, and each
 * surface offers its own way on, so a second set of links under the ask only
 * competed with it.
 *
 * The palette is inverted: the rule, the wordmark, the ask line, and the
 * outlined action are Chalk where the rest of the page draws them in Obsidian.
 * The address is the outlined action and its own label rather than a generic
 * "Email me", because this is the block where a recruiter copies it, and
 * `mailto:` still opens their own client on a phone. Below `sm` the action takes
 * the full width, so it stays level at the 360px floor.
 */
export function Footer() {
  return (
    <footer id="contact" data-reveal className="page-block bg-obsidian text-chalk">
      <div className="page-shell">
        <div className="flex flex-wrap items-start justify-between gap-x-24 gap-y-16">
          <div className="max-w-[48ch]">
            <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading uppercase">
              Let&apos;s talk
            </h2>

            <p className="page-head font-dm-sans text-body">{contact.ask}</p>
          </div>

          <a
            href={`mailto:${site.email}`}
            className="action-pill action-pill--dark w-full justify-center sm:w-auto"
          >
            {site.email}
          </a>
        </div>

        <hr className="page-break border-0 border-t-[1.5px] border-dotted border-chalk" />

        <div className="page-gap flex flex-wrap items-center justify-between gap-x-16 gap-y-8">
          <span className="flex items-center gap-8">
            <MountainGlyph />
            <span className="font-dm-sans text-body">{site.wordmark}</span>
          </span>
          <span className="font-system-sans-serif text-caption text-chalk/70">
            © {new Date().getFullYear()} {site.wordmark}
          </span>
        </div>
      </div>
    </footer>
  )
}
