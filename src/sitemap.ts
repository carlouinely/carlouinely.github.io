import { readdirSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { siteUrl } from './site'

/**
 * Write `sitemap.xml` and `robots.txt` into the prerendered client output.
 *
 * The sitemap is derived from the pages that actually shipped, not from a
 * source list, so adding a route cannot leave it behind. The build runs this
 * after the prerender, through the plugin in `vite.config.ts`.
 */
export function writeSeoFiles({ clientDir }: { clientDir: string }): void {
  const urls = shippedRoutePaths(clientDir).map((path) => siteUrl(path))
  writeFileSync(join(clientDir, 'sitemap.xml'), sitemapXml(urls))
  writeFileSync(join(clientDir, 'robots.txt'), robotsTxt())
}

function shippedRoutePaths(clientDir: string): string[] {
  return filesUnder(clientDir)
    .filter((file) => file.endsWith(`${sep}index.html`))
    .map((file) => {
      const path = relative(clientDir, file).split(sep).join('/')
      return path === 'index.html' ? '/' : `/${path.replace(/\/index\.html$/, '')}`
    })
    .sort((a, b) => a.localeCompare(b))
}

function filesUnder(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...filesUnder(path))
    else files.push(path)
  }
  return files
}

function sitemapXml(urls: string[]): string {
  const entries = urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n')
}

function robotsTxt(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl('/sitemap.xml')}`, ''].join('\n')
}
