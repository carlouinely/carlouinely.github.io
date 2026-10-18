import { createRouter } from '@tanstack/react-router'
import { NotFound } from '~src/components/NotFound'
import { routeTree } from '~src/routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // A loader that throws `notFound()` (an unknown Case Study slug) renders
    // the same page as the catch-all route. The `404.html` the static host
    // serves is that page prerendered.
    defaultNotFoundComponent: NotFound,
  })

  return router
}
