import { CvAction } from '~src/components/CvAction'
import { GitHubGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/**
 * The contact strip: the only dark surface on the site, closing the page after
 * About. The email is plain selectable text rather than a mailto link so a
 * recruiter can copy it into their own client, and the CV action sits in its
 * final position but stays inert until a redacted PDF exists.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Let's talk"
      data-reveal
      className="bg-obsidian px-24 py-56 md:py-80"
    >
      <div className="mx-auto max-w-page">
        <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-chalk uppercase md:text-heading-2xl">
          Let&apos;s talk
        </h2>

        <div className="mt-40 flex flex-wrap items-center gap-24">
          <p className="select-all font-dm-sans text-body text-chalk">{site.email}</p>

          <a
            href={site.github}
            className="inline-flex items-center gap-8 font-dm-sans text-body text-chalk underline"
          >
            <GitHubGlyph />
            GitHub
          </a>

          <CvAction />
        </div>
      </div>
    </section>
  )
}
