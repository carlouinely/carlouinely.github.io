import { Link } from '@tanstack/react-router'
import { ArrowGlyph } from '~src/components/glyphs'
import { StackList } from '~src/components/StackList'
import { experience } from '~src/content/experience'
import { projectsByCredit } from '~src/content/index'
import type { Project } from '~src/content/projects'

/**
 * One Case Study a role produced: the Project's title and year over the tools it
 * was built with, opened by the arrow every other Project link on the site
 * carries. The stack is the reason the block exists. A recruiter keyword-matches
 * the tools before reading a word of prose, and the employment history is where
 * they check whether that work happened on someone's payroll.
 */
function CreditedRow({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-16 gap-y-8 py-16"
    >
      <span className="font-pp-neue-corp-compact text-subheading font-regular tracking-heading text-obsidian uppercase transition-colors group-hover:text-ember">
        {project.title}
      </span>

      <ArrowGlyph className="arrow-nudge row-span-2 self-center text-obsidian transition-colors group-hover:text-ember" />

      <div className="col-span-2 flex flex-wrap items-center gap-x-16 gap-y-8">
        <span className="font-dm-sans text-body-sm text-obsidian">{project.year}</span>
        <StackList stack={project.stack} className="text-body-sm text-obsidian" />
      </div>
    </Link>
  )
}

/**
 * The Case Studies a role produced, joined on the Project's `credit`. The dotted
 * rule opens the group the way it opens a lead Project's stack, and every row
 * after the first draws its own top edge, so the block reads as the same
 * specimen list the Work section already uses. A role with nothing in the
 * catalogue renders no block rather than an empty promise.
 */
function CreditedWork({ employer }: { employer: string }) {
  const credited = projectsByCredit(employer)
  if (credited.length === 0) return null

  return (
    <div className="mt-24">
      <div data-rule className="border-t-[1.5px] border-dotted border-obsidian" />

      <p className="mt-16 font-system-sans-serif text-caption text-obsidian uppercase">
        Case studies from this role
      </p>

      <ul className="mt-8 flex flex-col">
        {credited.map((project, index) => (
          <li key={project.slug} data-row={index > 0 ? '' : undefined}>
            <CreditedRow project={project} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The employment history as a timeline: one dotted spine with an Ember dot per
 * role and the date opening each entry, so the marker the eye lands on is the
 * one that says when. Entries are grid rows rather than cards, so a role with
 * three outcomes and one with two keep the same top edge and the same columns
 * once the boxes are gone.
 *
 * The date, title, employer, and engagement hold a rail sized to the role they
 * carry, and the outcomes take everything else: given a fraction of the row the
 * rail took more width than any role needed, and the eye crossed a handspan of
 * empty page between a title and the proof beside it. Each role then closes on
 * the Case Studies it produced, so the history links into the evidence instead
 * of standing apart from it. The outcomes keep the reading measure while the
 * credited rows reach the page's right gutter, the way a Work row's rule does.
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

              <p className="col-start-2 row-start-1 font-dm-sans text-body-sm text-obsidian">
                {role.dates}
              </p>

              <div className="col-start-2 row-start-2">
                <h3 className="font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase">
                  {role.title}
                </h3>
                <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
                  <p className="font-dm-sans text-body md:text-body-lg text-obsidian">
                    {role.employer}
                  </p>
                  <p className="w-fit rounded-pills bg-sulfur px-12 py-4 font-dm-sans text-body-sm text-obsidian">
                    {role.engagement}
                  </p>
                </div>
              </div>

              <div className="col-start-2 row-start-3 mt-8 lg:col-start-3 lg:row-start-2">
                <p className="max-w-[36rem] font-dm-sans text-body md:text-body-lg text-obsidian">
                  {role.summary}
                </p>
                <ul className="mt-16 max-w-[36rem] list-disc space-y-12 pl-24 font-dm-sans text-body text-obsidian marker:text-ember md:text-body-lg">
                  {role.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <CreditedWork employer={role.employer} />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
