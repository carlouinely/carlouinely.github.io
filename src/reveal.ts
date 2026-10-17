import { useEffect } from 'react'

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
 * motion runs once.
 *
 * A single observer watches the document for the app's lifetime, because a
 * client-side route swap mounts its DOM after the router reports the new
 * location. Rebuilding the observer per route would query the outgoing page and
 * miss the incoming sections, leaving the back button's restored page blank.
 */
export function useReveal(): void {
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-visible', '')
          reveal.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    const pending = (root: Element | Document) =>
      root.querySelectorAll('[data-reveal]:not([data-visible])')

    const watch = (node: Node) => {
      if (!(node instanceof Element)) return
      if (node.matches('[data-reveal]:not([data-visible])')) reveal.observe(node)
      for (const element of pending(node)) reveal.observe(element)
    }

    for (const element of pending(document)) reveal.observe(element)

    const arrivals = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) watch(node)
      }
    })
    arrivals.observe(document.body, { childList: true, subtree: true })

    return () => {
      reveal.disconnect()
      arrivals.disconnect()
    }
  }, [])
}
