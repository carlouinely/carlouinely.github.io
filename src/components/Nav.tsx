import { useEffect, useRef, useState } from 'react'
import { CloseGlyph, MenuGlyph } from '~src/components/glyphs'
import { useNavPosition } from '~src/nav-position'
import { site } from '~src/site'

/** The panel id the trigger controls. One nav per page, so one stable id. */
const PANEL_ID = 'primary-menu'

/**
 * Where the nav goes: the home page's sections, in the order they read. The
 * Projects Index is not among them, because the Work section's own action and
 * the footer both open it, and a fifth label would only crowd the row. Each
 * link names the section `id` it points at, so the nav can say which one the
 * visitor is reading without parsing its own hrefs.
 */
const LINKS = [
  { label: 'About me', href: '/#about', id: 'about' },
  { label: 'How I work', href: '/#how-i-work', id: 'how-i-work' },
  { label: "Things I've built", href: '/#work', id: 'work' },
  { label: "Where I've worked", href: '/#experience', id: 'experience' },
] as const

/**
 * The site nav. The pill sticks to the top of the viewport, and the section
 * being read wears the same Ember dot the employment spine marks a role with,
 * so four thousand pixels of scrolling keep a place in the document rather
 * than reading as a stack of blocks with no chrome.
 *
 * The header carries no background of its own, so the pill floats on the page:
 * content scrolls behind it and disappears only where the pill itself covers
 * it, instead of being cut at an invisible band around the pill.
 *
 * On wide viewports the links sit inline in the pill; below the extra-large
 * breakpoint they collapse behind a trigger whose panel holds the same links,
 * because the labels stop fitting on one row before that and would otherwise
 * break mid-phrase. The extra-large breakpoint is the page's own max width, so
 * the nav only opens up once the row it sits in can hold it.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const { activeId } = useNavPosition(navRef)

  useEffect(() => {
    if (!open) return

    const close = () => setOpen(false)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close()
    }
    // A resize past the breakpoint would otherwise leave the state stuck open.
    const wide = window.matchMedia('(min-width: 80rem)')
    const onWide = () => {
      if (wide.matches) close()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    wide.addEventListener('change', onWide)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <header className="pointer-events-none sticky top-0 z-20 px-12 py-12 md:px-24">
      <nav
        ref={navRef}
        aria-label="Primary"
        className="pointer-events-auto relative mx-auto flex w-full max-w-page items-center gap-4 rounded-pills bg-limestone px-12 py-12 md:gap-9 md:px-24"
      >
        <a href="/" className="mr-auto text-obsidian" onClick={() => setOpen(false)}>
          <span className="font-dm-sans text-body">{site.wordmark}</span>
        </a>

        <ul
          id={PANEL_ID}
          className={`${
            open ? 'flex' : 'hidden'
          } absolute left-0 right-0 top-full z-10 mt-8 flex-col gap-4 rounded-cards bg-limestone p-16 xl:static xl:mt-0 xl:flex xl:flex-row xl:items-center xl:gap-9 xl:rounded-none xl:bg-transparent xl:p-0`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={activeId === link.id ? 'location' : undefined}
                className="flex items-center gap-8 rounded-pills px-12 py-8 font-dm-sans text-body text-obsidian xl:py-0"
              >
                {/* The slot is always held, so moving down the page lights the
                    dot up instead of shifting the row under the pointer. */}
                <span
                  aria-hidden
                  className={`nav-dot shrink-0 ${activeId === link.id ? 'opacity-100' : 'opacity-0'}`}
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={PANEL_ID}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="flex shrink-0 items-center rounded-pills px-12 py-12 text-obsidian xl:hidden"
        >
          {open ? <CloseGlyph /> : <MenuGlyph />}
        </button>
      </nav>
    </header>
  )
}
