import { CvAction } from '~src/components/CvAction'
import { Media } from '~src/components/Media'
import { site } from '~src/site'

/**
 * The home hero: the display claim and recruiter-facing subline on the left,
 * the reserved brand-artwork card on the right.
 */
export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-page items-center gap-40 px-24 py-48 md:grid-cols-2">
      <div>
        <h1 className="font-pp-neue-corp-compact text-heading-2xl font-regular tracking-heading text-obsidian uppercase md:text-heading-3xl lg:text-display">
          {site.role.toUpperCase()}
        </h1>

        <p className="mt-24 font-dm-sans text-body text-obsidian">{site.location}</p>

        <p className="mt-16 w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
          {site.availability}
        </p>

        <div className="mt-40 flex flex-wrap items-center gap-16">
          <CvAction />
          <a
            href={`mailto:${site.email}`}
            className="rounded-buttons border-[1.5px] border-obsidian p-16 font-dm-sans text-body text-obsidian"
          >
            Email me
          </a>
        </div>
      </div>

      {/* The hero card is reserved for brand artwork, never a portrait. */}
      {/* TODO(placeholder:hero-artwork): replace the placeholder with real brand artwork by adding a `src`. See PLACEHOLDERS.md. */}
      <Media kind="halftone" ratio="4 / 3" label="Hero brand artwork" />
    </section>
  )
}
