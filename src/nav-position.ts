import { useEffect, useState, type RefObject } from 'react'

/** The home page's sections, in the order they read, as the nav links name them. */
const SECTIONS = ['about', 'how-i-work', 'work', 'experience', 'contact'] as const

/** How far past the nav's own bottom edge a section counts as the current one. */
const READING_LINE = 8

/**
 * Which home section the visitor is reading, for the nav's dot. The boundary is
 * the nav itself, so a section is current once its heading has passed under the
 * pill rather than once it has passed the viewport's own top edge.
 *
 * The active section is state because it changes a handful of times per visit
 * and a link has to re-render when it does. The measurement runs at most once
 * per frame, so a fast trackpad cannot queue up work the way a raw scroll
 * handler can.
 */
export function useNavPosition(boundary: RefObject<HTMLElement | null>): {
  activeId: string | null
} {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0

      // The last section whose heading has passed the pill is the one being
      // read. Nothing has passed it at the top of the page, so no link is marked
      // until a section actually arrives.
      const line = (boundary.current?.getBoundingClientRect().bottom ?? 0) + READING_LINE
      let current: string | null = null
      for (const id of SECTIONS) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= line) current = id
      }
      setActiveId(current)
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [boundary])

  return { activeId }
}
