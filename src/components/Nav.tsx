import { useEffect, useRef, useState } from 'react'
import { CvAction } from '~src/components/CvAction'
import { CloseGlyph, GitHubGlyph, MenuGlyph, MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

/** The panel id the trigger controls. One nav per page, so one stable id. */
const PANEL_ID = 'primary-menu'

/** Where the nav goes: the home sections, then the full catalogue. */
const LINKS = [
  { label: 'About me', href: '/#about' },
  { label: "Things I've built", href: '/#work' },
  { label: "Where I've worked", href: '/#experience' },
  { label: 'Projects', href: '/projects' },
] as const

/**
 * The site nav. On wide viewports the links sit inline in the pill; below the
 * large breakpoint they collapse behind a trigger whose panel holds the same
 * links, because four labels and the CV action stop fitting on one row before
 * that and would otherwise break mid-phrase. The CV action never enters the
 * panel, so the primary action stays visible whichever way the menu is.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

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
    const wide = window.matchMedia('(min-width: 64rem)')
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
    <header className="mx-auto w-full max-w-page px-12 py-24 md:px-24">
      <nav
        ref={navRef}
        aria-label="Primary"
        className="relative flex items-center gap-4 rounded-pills bg-limestone px-12 py-12 md:gap-9 md:px-24"
      >
        <a
          href="/"
          className="mr-auto flex items-center gap-9 text-obsidian"
          onClick={() => setOpen(false)}
        >
          <MountainGlyph />
          <span className="font-dm-sans text-body">{site.wordmark}</span>
        </a>

        <ul
          id={PANEL_ID}
          className={`${
            open ? 'flex' : 'hidden'
          } absolute left-0 right-0 top-full z-10 mt-8 flex-col gap-4 rounded-cards bg-limestone p-16 lg:static lg:mt-0 lg:flex lg:flex-row lg:items-center lg:gap-9 lg:rounded-none lg:bg-transparent lg:p-0`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-pills px-12 py-8 font-dm-sans text-body text-obsidian lg:py-0"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={site.github}
          aria-label="GitHub"
          rel="me"
          className="hidden items-center px-12 py-4 text-obsidian lg:flex"
        >
          <GitHubGlyph />
        </a>

        <CvAction />

        <button
          type="button"
          aria-expanded={open}
          aria-controls={PANEL_ID}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="flex shrink-0 items-center rounded-pills px-8 py-8 text-obsidian lg:hidden"
        >
          {open ? <CloseGlyph /> : <MenuGlyph />}
        </button>
      </nav>
    </header>
  )
}
