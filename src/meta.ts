import { siteUrl } from '~src/site'

/**
 * The per-route document head. A route supplies its own title, description, and
 * path; the canonical URL and the Open Graph tags are derived from the canonical
 * origin here so no route hand-writes a URL. The root route fills in the
 * site-wide tags every page inherits.
 */
export function pageHead({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) {
  const url = siteUrl(path)

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
