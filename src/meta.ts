import type { Project } from '~src/content/projects'
import { site, siteUrl } from '~src/site'

/**
 * The per-route document head. A route supplies its own title, description,
 * path, and Open Graph type; the canonical URL and the shared tags are derived
 * from the canonical origin here so no route hand-writes a URL. The root route
 * fills in the site-wide tags every page inherits.
 */
export function pageHead({
  title,
  description,
  path,
  ogType = 'website',
}: {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
}) {
  const url = siteUrl(path)

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

/**
 * The document head for the Not Found page. The catch-all route and an unknown
 * Case Study slug both render the same page, so they share one head: a title, a
 * plain description, and no canonical, because a missing URL is not an address
 * worth indexing.
 */
export function notFoundHead() {
  const title = `Page not found | ${site.wordmark}`
  const description =
    'That page is not here. Head back to the home page or browse the projects I have shipped.'

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'noindex' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }
}

/** The fields a Project contributes to its Case Study's structured data. */
type CaseStudyIdentity = Pick<Project, 'title' | 'summary' | 'tag' | 'slug'>

/**
 * A JSON-LD script node for the document head. Escaping `<` keeps data from
 * closing the `<script>` element it is embedded in.
 */
export function jsonLd(data: Record<string, unknown>) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data).replace(/</g, '\\u003c'),
  }
}

/** The home page's Person structured data, describing the site's owner. */
export function personStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.wordmark,
    jobTitle: site.role,
    url: siteUrl('/'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressCountry: site.address.country,
    },
    alumniOf: { '@type': 'CollegeOrUniversity', name: site.alumniOf },
    sameAs: [site.github, site.linkedin],
  }
}

/** The trail from the home page to a Case Study, for its BreadcrumbList. */
export function breadcrumbStructuredData(project: CaseStudyIdentity): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: siteUrl('/projects') },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: siteUrl(`/projects/${project.slug}`),
      },
    ],
  }
}

/** A Case Study as an Article, so search engines understand the page. */
export function articleStructuredData(project: CaseStudyIdentity): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.summary,
    articleSection: project.tag,
    author: { '@type': 'Person', name: site.wordmark, url: siteUrl('/') },
    image: siteUrl(site.assets.openGraphImage),
    mainEntityOfPage: siteUrl(`/projects/${project.slug}`),
  }
}
