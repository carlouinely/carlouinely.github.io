import { about } from '~src/content/about'

/**
 * How I work: the working-style passage, pulled out of About and given the
 * page's one Ember surface. It is the part of the pitch a neighbouring
 * portfolio cannot copy, so it gets a beat of its own instead of being a third
 * block under the summary. The two passages sit side by side, which keeps the
 * band short and holds each one to a readable measure.
 *
 * The band is the page's one Ember surface, so it is one of the two blocks that
 * pours its own surface in as it arrives. The surface is a layer under the
 * content rather than the section's own background, which is what lets it be
 * painted on instead of being there already.
 */
export function HowIWork() {
  return (
    <section
      id="how-i-work"
      aria-label="How I work"
      data-reveal
      data-band
      className="page-block relative"
    >
      <div aria-hidden className="band-surface bg-ember" />

      {/* The band bleeds, but its content still lands on the page grid: the
          padding sits on the capped inner box, not on the full-width section. */}
      <div className="page-shell">
        <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
          How I work
        </h2>

        {/* Obsidian on Ember is the pairing the primary action already uses, and
            it clears AA where Chalk on Ember would not. */}
        <div className="page-head grid gap-24 md:grid-cols-2 md:gap-40" data-stagger>
          {about.howIWork.map((paragraph) => (
            <p key={paragraph} className="font-dm-sans text-body md:text-body-lg text-obsidian">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
