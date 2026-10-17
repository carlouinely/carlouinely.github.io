import { CvAction } from '~src/components/CvAction'
import { Media } from '~src/components/Media'
import { site } from '~src/site'

/**
 * The home hero: the display claim and the reserved brand-artwork panel share
 * one baseline, a dotted axis rule closes that block, and the rail below it
 * carries where this is beside the two actions a recruiter can take.
 */
export function Hero() {
  return (
    <section data-hero className="page-shell page-block">
      <div className="grid items-end gap-24 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] md:gap-40">
        <h1 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase sm:text-heading-2xl md:text-heading-3xl xl:text-display">
          {site.role.toUpperCase()}
        </h1>

        {/* The hero card is reserved for brand artwork, never a portrait. */}
        {/* TODO(placeholder:hero-artwork): replace the placeholder with real brand artwork by adding a `src`. See PLACEHOLDERS.md. */}
        <Media kind="halftone" ratio="4 / 3" label="Hero brand artwork" />
      </div>

      <div aria-hidden className="page-gap border-t-[1.5px] border-dotted border-obsidian" />

      <div className="page-gap flex flex-col gap-24 md:flex-row md:items-center md:justify-between md:gap-40">
        <div className="flex flex-wrap items-center gap-x-16 gap-y-8">
          <p className="font-dm-sans text-body text-obsidian">{site.location}</p>
          <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian uppercase">
            {site.availability}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-16">
          <CvAction />
          <a href={`mailto:${site.email}`} className="action-pill action-pill--quiet">
            Email me
          </a>
        </div>
      </div>
    </section>
  )
}
