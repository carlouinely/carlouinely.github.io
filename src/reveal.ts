import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

/**
 * The inline head script that opts the document into reveals. It runs before
 * the first paint, so it only sets the class when scripts can actually reveal
 * the sections again: without it every section ships visible, which is the
 * no-script and reduced-motion fallback.
 */
export const revealBootstrap = `(function(){try{if(!('IntersectionObserver' in window))return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('reveal-enabled')}catch(e){}})()`

/**
 * Reveals each `[data-reveal]` element once it enters the viewport, by marking
 * it `data-visible`. An element is unobserved after its single reveal, so the
 * motion runs once. The observer rebuilds per route so client-side navigation
 * picks up the new page's sections.
 */
export function useReveal(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-visible])')
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-visible', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [pathname])
}
