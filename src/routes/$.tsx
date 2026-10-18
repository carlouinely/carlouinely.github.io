import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '~src/components/NotFound'
import { notFoundHead } from '~src/meta'

/**
 * The catch-all route. Every URL the site does not name lands here, so the
 * prerendered `404.html` and the client-side router both show the same page.
 * The route stays out of the prerenderer's static path discovery because its
 * path carries `$`; `vite.config.ts` asks for it explicitly as `404.html`.
 */
export const Route = createFileRoute('/$')({
  head: () => notFoundHead(),
  component: NotFound,
})
