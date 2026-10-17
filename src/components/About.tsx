import { ToolGlyph } from '~src/components/toolGlyphs'
import { about } from '~src/content/about'

/**
 * About: the short version of who this is, set as a lede rather than a
 * paragraph, then the stack at full width so it reads as a spec band instead of
 * three columns squeezed into a sidebar. The working-style passage has its own
 * section, so this one carries only the summary and the keyword match.
 */
export function About() {
  return (
    <section id="about" aria-label="About me" data-reveal className="page-shell page-block">
      <h2 className="font-pp-neue-corp-compact text-heading-lg font-regular tracking-heading text-obsidian uppercase">
        About me
      </h2>

      {/* The lede is a wide-viewport gesture: at 30px a phone turns the same
          words into fourteen lines of large print, so it steps down to body
          size until the column can hold it. */}
      <p className="page-head max-w-[48ch] font-dm-sans text-body text-obsidian md:text-heading-sm">
        {about.summary}
      </p>

      <div aria-hidden className="page-gap border-t-[1.5px] border-dotted border-obsidian" />

      <div className="page-gap grid gap-24 sm:grid-cols-3 md:gap-0">
        {about.stack.map((group, index) => (
          <div
            key={group.label}
            // The dotted rule between groups is the same divider the nav and
            // the hero axis rule use; it turns three lists into one spec band.
            className={
              index > 0 ? 'md:border-l-[1.5px] md:border-dotted md:border-obsidian md:pl-40' : ''
            }
          >
            <h3 className="font-pp-neue-corp-compact text-subheading font-regular tracking-heading text-obsidian uppercase">
              {group.label}
            </h3>
            <ul className="mt-16 space-y-8 font-dm-sans text-body text-obsidian">
              {group.tools.map((tool) => (
                <li key={tool} className="flex items-center gap-8">
                  <ToolGlyph tool={tool} className="shrink-0" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
