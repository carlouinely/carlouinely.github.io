import { experience } from '~src/content/experience'

/**
 * The employment history as a timeline: one dotted spine with an Ember dot per
 * role and the date opening each entry, so the marker the eye lands on is the
 * one that says when. Entries are grid rows rather than cards, so a role with
 * three outcomes and one with two keep the same top edge and the same columns
 * once the boxes are gone. The date takes the first row alone, which leaves the
 * role and its outcomes opening on one line and holds the body measure on a
 * wide screen. The engagement is tagged so freelance and full-time work stay
 * distinguishable.
 *
 * The spine unwinds from its first dot as the section arrives and each dot
 * lands a beat behind the entry it dates, so the history is drawn rather than
 * already laid out.
 */
export function Experience() {
  return (
    <section
      id="experience"
      aria-label="Where I've worked"
      data-reveal
      className="page-shell page-block"
    >
      <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
        Where I&apos;ve worked
      </h2>

      <ol className="timeline page-head" data-stagger>
        {experience.map((role) => (
          <li key={`${role.employer}-${role.dates}`}>
            <article className="timeline-entry">
              <span aria-hidden data-dot className="timeline-dot col-start-1 row-start-1" />

              <p className="col-start-2 row-start-1 font-system-sans-serif text-caption text-obsidian">
                {role.dates}
              </p>

              <div className="col-start-2 row-start-2">
                <h3 className="font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase">
                  {role.title}
                </h3>
                <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
                  <p className="font-dm-sans text-body text-obsidian">{role.employer}</p>
                  <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
                    {role.engagement}
                  </p>
                </div>
              </div>

              <div className="col-start-2 row-start-3 mt-8 md:col-start-3 md:row-start-2 md:mt-0">
                <p className="font-dm-sans text-body text-obsidian">{role.summary}</p>
                <ul className="mt-16 space-y-8 list-disc pl-24 font-dm-sans text-body text-obsidian">
                  {role.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
