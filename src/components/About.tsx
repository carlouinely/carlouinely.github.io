import { SocialLinks } from '~src/components/SocialLinks'
import { about } from '~src/content/about'

/**
 * About: the short version of who this is, set as a lede rather than a
 * paragraph, with the address and both profiles gathered under it so a visitor
 * has one place to find the owner. The working-style passage has its own
 * section, so this one carries only the summary and the links.
 *
 * The heading and the lede share a row from the medium breakpoint up, so the
 * section reads as one statement rather than a heading with a lone column under
 * it; the links stay in the lede's column so they read as belonging to it.
 */
export function About() {
  return (
    <section id="about" aria-label="About me" data-reveal className="page-shell page-block">
      <div className="grid gap-24 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-x-40">
        <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
          About me
        </h2>

        <div>
          {/* The lede is a wide-viewport gesture: at 30px a phone turns the same
              words into fourteen lines of large print, so it steps up only once
              the column beside the heading can hold it. */}
          <p className="max-w-[46ch] font-dm-sans text-body-lg text-obsidian lg:text-heading-sm">
            {about.summary}
          </p>

          <SocialLinks tone="light" includeEmail className="page-gap" />
        </div>
      </div>
    </section>
  )
}
