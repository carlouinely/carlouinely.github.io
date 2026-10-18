import { SocialLinks } from '~src/components/SocialLinks'
import { contact } from '~src/content/contact'
import { site } from '~src/site'

/**
 * The site's one closing block, and its only dark surface. Two groups: the ask
 * with the address it offers, then the profiles and the copyright under a
 * dotted rule.
 *
 * The address is the block's action, because contact is what the last screen of
 * the page is for. The CV action stays in the hero, so the footer never repeats
 * it; the profiles do repeat here, because a visitor who has read the whole page
 * may want the work behind it.
 *
 * Its ask row is the same row the home sections open with: a heading on the
 * gutter, the line that supports it under it, and the action on the opposite
 * edge, at the same gaps as "Things I've built". The heading is the one
 * exception, and it steps up above every section heading on wide viewports: the
 * closing block is where the page stops being a document and becomes an ask, so
 * it answers the hero's scale rather than trailing off at the sections' own. The
 * row under the rule centres on the page, profiles first and the copyright
 * under them, so the name closes the page on its own axis.
 *
 * There is no site map here. The nav already carries every section, and each
 * surface offers its own way on, so a second set of links under the ask only
 * competed with it.
 *
 * The palette is inverted: the rule, the profiles, the ask line, and the
 * outlined action are Chalk where the rest of the page draws them in Obsidian.
 * The address is the outlined action and its own label rather than a generic
 * "Email me", because this is the block where a recruiter copies it, and
 * `mailto:` still opens their own client on a phone. Below `sm` the action takes
 * the full width, so it stays level at the 360px floor.
 *
 * The dark surface is the page's second and last band, so it pours in the way
 * the Ember band does. It is a layer under the content rather than the footer's
 * own background, which is what lets it be painted on.
 */
export function Footer() {
  return (
    <footer id="contact" data-reveal data-band className="page-block relative text-chalk">
      <div aria-hidden className="band-surface bg-obsidian" />

      <div className="page-shell">
        {/* The ask and the address it offers share one baseline, the way the
            hero's claim and its artwork do: the action belongs to the sentence
            above it, not floating at the top of the block. */}
        <div className="flex flex-wrap items-end justify-between gap-x-24 gap-y-16">
          <div className="max-w-[48ch]">
            <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading uppercase md:text-heading-2xl">
              Let&apos;s talk
            </h2>

            <p className="page-head font-dm-sans text-body md:text-body-lg">{contact.ask}</p>
          </div>

          <a
            href={`mailto:${site.email}`}
            className="action-pill action-pill--dark w-full justify-center sm:w-auto"
          >
            {site.email}
          </a>
        </div>

        <hr data-rule className="page-break border-0 border-t-[1.5px] border-dotted border-chalk" />

        <div className="page-gap flex flex-col items-center gap-16">
          <SocialLinks tone="dark" />
          <p className="font-dm-sans text-caption text-chalk/70">
            © {new Date().getFullYear()} {site.wordmark}
          </p>
        </div>
      </div>
    </footer>
  )
}
