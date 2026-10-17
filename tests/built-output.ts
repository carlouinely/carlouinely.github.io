import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const root = process.cwd()
export const clientDir = join(root, 'dist', 'client')

const BUILD_INPUTS = ['src', 'projects', 'package.json', 'tsconfig.json', 'vite.config.ts']

/** Every file under a directory, skipping `node_modules` and dot-folders. */
export function walkFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkFiles(path))
    else files.push(path)
  }
  return files
}

function newestMtime(path: string): number {
  const stats = statSync(path)
  if (!stats.isDirectory()) return stats.mtimeMs
  return walkFiles(path).reduce(
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
      'Built client output not found at dist/client. The suite reads the real build, so run `vp run build` before `vp run test` (the deploy workflow runs the build step first).',
    )
  }

  const builtAt = newestMtime(clientDir)
  for (const input of BUILD_INPUTS) {
    const path = join(root, input)
    if (!existsSync(path)) continue

    if (newestMtime(path) > builtAt) {
      throw new Error(
        `Built client output at dist/client is stale: ${input} changed after it was built. Run \`vp run build\` before \`vp run test\` so the suite reads the current site.`,
      )
    }
  }
}

/** Any file the build shipped under `dist/client`, read through the same seam as a page. */
export function readBuiltFile(path: string): string {
  const file = join(clientDir, path)
  if (!existsSync(file)) {
    throw new Error(`Expected a built file at dist/client/${path}, but it was not found.`)
  }
  return readFileSync(file, 'utf8')
}

export function readClientPage(path: string): string {
  return readBuiltFile(path)
}

export type BuiltPage = {
  /** The route path, as it appears in canonical and Open Graph URLs. */
  path: string
  html: string
}

/**
 * Every page the build shipped, as its route path and delivered HTML, sorted by
 * path. Deriving from the built output means a new route is covered the moment
 * it ships, with no source list to keep in step.
 */
export function builtPages(): BuiltPage[] {
  return walkFiles(clientDir)
    .filter((file) => file.endsWith(`${sep}index.html`))
    .map((file) => {
      const relativePath = relative(clientDir, file).split(sep).join('/')
      return {
        path:
          relativePath === 'index.html' ? '/' : `/${relativePath.replace(/\/index\.html$/, '')}`,
        html: readFileSync(file, 'utf8'),
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

/** The delivered home page from its start marker to an end marker, end exclusive. */
function sliceHome(fromId: string, endMarker: string, endLabel: string): string {
  const html = readClientPage('index.html')
  const start = html.indexOf(`id="${fromId}"`)
  const end = html.indexOf(endMarker)
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Could not find the "${fromId}" landmark before ${endLabel} on the home page.`)
  }
  return html.slice(start, end)
}

/** The delivered home page between two section landmarks, end exclusive. */
export function homeSection(fromId: string, toId: string): string {
  return sliceHome(fromId, `id="${toId}"`, `the "${toId}" landmark`)
}

/** A built page's footer landmark through to the end of its body. */
export function footerRegion(html: string): string {
  const start = html.indexOf('<footer')
  const end = html.indexOf('</body>')
  if (start === -1 || end === -1 || end < start) throw new Error('The page has no footer.')
  return html.slice(start, end)
}

/** The rendered cards in a section of the home page, in document order. */
export function cardsIn(region: string): string[] {
  return region.split(/(?=<article\b)/).slice(1)
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

/**
 * The opening `<svg>` tag of the decorative mark rendered immediately before a
 * tool name, or `null` when the tool has no mark. Reading the actual delivered
 * adjacency is what makes "an icon beside the name" an observable claim.
 */
export function toolMarkBefore(html: string, tool: string): string | null {
  const escaped = tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(
    new RegExp(`(<svg\\b[^>]*>)[\\s\\S]*?</svg>(?:<!--[\\s\\S]*?-->|\\s)*${escaped}`),
  )
  return match?.[1] ?? null
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
