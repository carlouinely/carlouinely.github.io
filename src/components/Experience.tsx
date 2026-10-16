import { experience } from '~src/content/experience'

/**
 * The employment history. The engagement is tagged so freelance and full-time
 * work stay distinguishable, and each role is reduced to a summary line plus its
 * outcomes so the section scans in seconds.
 */
export function Experience() {
  return (
    <section
      id="experience"
      aria-label="Where I've worked"
      className="mx-auto max-w-page px-24 py-48"
    >
      <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
        Where I&apos;ve worked
      </h2>

      <div className="mt-40 flex flex-col gap-24">
        {experience.map((role) => (
          <article
            key={`${role.employer}-${role.dates}`}
            className="rounded-cards bg-limestone p-40"
          >
            <div className="grid gap-24 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div>
                <h3 className="font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase">
                  {role.title}
                </h3>
                <p className="mt-8 font-dm-sans text-body text-obsidian">{role.employer}</p>
                <p className="mt-8 font-system-sans-serif text-caption text-obsidian">
                  {role.dates}
                </p>
                <p className="mt-16 w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-caption text-obsidian">
                  {role.engagement}
                </p>
              </div>

              <div>
                <p className="font-dm-sans text-body text-obsidian">{role.summary}</p>
                <ul className="mt-16 space-y-8 list-disc pl-24 font-dm-sans text-body text-obsidian">
                  {role.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
