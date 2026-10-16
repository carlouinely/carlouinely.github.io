import { Media } from '~src/components/Media'
import { about } from '~src/content/about'

/**
 * About: the summary, the stack grouped for keyword-matching, a prose passage on
 * how the work actually happens, and the portrait slot: a Placeholder through
 * Media until a real duotone portrait exists.
 */
export function About() {
  return (
    <section id="about" aria-label="About me" className="mx-auto max-w-page px-24 py-48">
      <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
        About me
      </h2>

      <div className="mt-40 grid gap-40 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <p className="font-dm-sans text-body text-obsidian">{about.summary}</p>

          <div className="mt-40 grid gap-32 sm:grid-cols-3">
            {about.stack.map((group) => (
              <div key={group.label}>
                <h3 className="font-pp-neue-corp-compact text-subheading font-regular tracking-heading text-obsidian uppercase">
                  {group.label}
                </h3>
                <ul className="mt-16 space-y-8 font-dm-sans text-body text-obsidian">
                  {group.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-48 font-pp-neue-corp-compact text-heading font-regular tracking-heading text-obsidian uppercase">
            How I work
          </h3>
          {about.howIWork.map((paragraph) => (
            <p key={paragraph} className="mt-16 font-dm-sans text-body text-obsidian">
              {paragraph}
            </p>
          ))}
        </div>

        {/* The portrait slot. */}
        {/* TODO(placeholder:portrait): add a `src` to the Media prop once a real duotone portrait exists. See PLACEHOLDERS.md. */}
        <Media kind="halftone" ratio="4 / 5" label="Portrait" />
      </div>
    </section>
  )
}
