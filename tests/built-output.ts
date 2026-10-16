import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
export const clientDir = join(root, 'dist', 'client')

const BUILD_INPUTS = ['src', 'projects', 'package.json', 'tsconfig.json', 'vite.config.ts']

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(path))
    else files.push(path)
  }
  return files
}

function newestMtime(path: string): number {
  const stats = statSync(path)
  if (!stats.isDirectory()) return stats.mtimeMs
  return walk(path).reduce(
    (newest, file) => Math.max(newest, statSync(file).mtimeMs),
    stats.mtimeMs,
  )
}

/**
 * Fail loudly when the built client output the suite reads is absent or older
 * than the sources it was built from. A silently-passing suite against a stale
 * `dist/client` would hide exactly the regressions these tests exist to catch.
 */
export function requireFreshBuild(): void {
  const indexHtml = join(clientDir, 'index.html')
  if (!existsSync(indexHtml)) {
    throw new Error(
      'Built client output not found at dist/client. The suite reads the real build, so run `vp build` before `vp test` (the deploy workflow runs the build step first).',
    )
  }

  const builtAt = newestMtime(clientDir)
  for (const input of BUILD_INPUTS) {
    const path = join(root, input)
    if (!existsSync(path)) continue

    if (newestMtime(path) > builtAt) {
      throw new Error(
        `Built client output at dist/client is stale: ${input} changed after it was built. Run \`vp build\` before \`vp test\` so the suite reads the current site.`,
      )
    }
  }
}

export function readClientPage(path: string): string {
  const file = join(clientDir, path)
  if (!existsSync(file)) {
    throw new Error(`Expected a built page at dist/client/${path}, but it was not found.`)
  }
  return readFileSync(file, 'utf8')
}

/** The delivered HTML a visitor (or crawler) actually receives, with tags removed. */
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function internalLinks(html: string): string[] {
  const links: string[] = []
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const href = match[1]
    if (href && href.startsWith('/') && !href.startsWith('//')) links.push(href)
  }
  return [...new Set(links)]
}

/** Every `id` a visitor could jump to with an anchor. */
export function elementIds(html: string): string[] {
  return [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1])
}

/** Resolve a site-relative link the way GitHub Pages serves the prerendered output. */
export function pageExists(href: string): boolean {
  const path = href.split(/[?#]/)[0]
  const relative = path.replace(/^\/+/, '')
  if (!relative) return existsSync(join(clientDir, 'index.html'))
  const candidates = path.endsWith('/')
    ? [join(relative, 'index.html')]
    : [relative, `${relative}.html`, join(relative, 'index.html')]
  return candidates.some((candidate) => existsSync(join(clientDir, candidate)))
}
