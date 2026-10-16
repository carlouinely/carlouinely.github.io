import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { Footer } from '~src/components/Footer'
import { Nav } from '~src/components/Nav'
import { revealBootstrap, useReveal } from '~src/reveal'
import { site, siteUrl } from '~src/site'
import styles from '~src/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Site-wide fallbacks; each route overrides the title and description via `pageHead`.
      { title: site.defaultTitle },
      { name: 'description', content: site.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.wordmark },
      { property: 'og:title', content: site.defaultTitle },
      { property: 'og:description', content: site.description },
      { property: 'og:image', content: siteUrl(site.assets.openGraphImage) },
      { property: 'og:image:width', content: String(site.assets.openGraphImageWidth) },
      { property: 'og:image:height', content: String(site.assets.openGraphImageHeight) },
      { property: 'og:image:alt', content: `${site.wordmark} | ${site.role}` },
      { property: 'og:url', content: siteUrl() },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'theme-color', content: site.themeColor },
    ],
    links: [
      { rel: 'stylesheet', href: styles },
      { rel: 'icon', type: 'image/svg+xml', href: site.assets.favicon },
      { rel: 'apple-touch-icon', href: site.assets.appleTouchIcon },
    ],
    // Runs before first paint so a section is never shown and then hidden.
    scripts: [{ children: revealBootstrap }],
  }),
  component: RootComponent,
})

function RootComponent() {
  useReveal()

  return (
    <RootDocument>
      <Nav />
      <Outlet />
      <Footer />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
