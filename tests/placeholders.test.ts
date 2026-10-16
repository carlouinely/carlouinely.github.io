import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { beforeAll, describe, expect, it } from 'vite-plus/test'
import { clientDir, requireFreshBuild, walkFiles } from './built-output'

/**
 * The launch audit. The registry is reconciled against the `TODO` markers in
 * source, so a Placeholder nothing flags, or a flag with no registry row, fails
 * here; and the real production build is checked for the development-only
 * markers the Media primitive would otherwise leak.
 */

const root = process.cwd()

/** Authored site source scanned for Placeholder markers. */
const SOURCE_ROOTS = ['src', 'projects']

type Occurrence = {
  /** The registry key, or `null` for a `TODO` that is not a Placeholder marker. */
  key: string | null
  file: string
}

/** Every `TODO` in source, with the Placeholder key when it carries one. */
function occurrences(): Occurrence[] {
  const found: Occurrence[] = []
  const marker = /TODO(?:\(placeholder:([a-z0-9-]+)\))?/g

  for (const dir of SOURCE_ROOTS) {
    for (const file of walkFiles(join(root, dir))) {
      for (const match of readFileSync(file, 'utf8').matchAll(marker)) {
        found.push({ key: match[1] ?? null, file: relative(root, file) })
      }
    }
  }

  return found
}

/** The cell contents of every row in the `PLACEHOLDERS.md` table, header excluded. */
function registryRows(): string[][] {
  return readFileSync(join(root, 'PLACEHOLDERS.md'), 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|\s*-/.test(line))
    .slice(1)
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
}

/** The keys listed in the first column of the `PLACEHOLDERS.md` table. */
function registryKeys(): string[] {
  return registryRows().map((cells) => cells[0]?.match(/^`([a-z0-9-]+)`$/)?.[1] ?? '')
}

/** Every built file under `dist/client`, HTML and assets alike. */
function builtFiles(): string[] {
  return walkFiles(clientDir).map((file) => readFileSync(file, 'utf8'))
}

beforeAll(() => {
  requireFreshBuild()
})

describe('the Placeholders registry', () => {
  it('lists at least one Placeholder, with a parseable key in every row', () => {
    const rows = registryRows()
    expect(rows.length).toBeGreaterThan(0)

    const malformed = rows.filter((cells) => !/^`[a-z0-9-]+`$/.test(cells[0] ?? ''))
    expect(malformed).toEqual([])
  })

  it('gives every Placeholder a unique key', () => {
    const keys = registryKeys()
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('marks every TODO with a registered key', () => {
    const found = occurrences()
    expect(found.length).toBeGreaterThan(0)

    expect(found.filter((occurrence) => occurrence.key === null)).toEqual([])

    const keys = new Set(registryKeys())
    const unknown = found
      .map((occurrence) => occurrence.key)
      .filter((key): key is string => key !== null && !keys.has(key))
    expect(unknown).toEqual([])
  })

  it('lists nothing that no longer exists', () => {
    const marked = new Set(occurrences().map((occurrence) => occurrence.key))
    const stale = registryKeys().filter((key) => !marked.has(key))
    expect(stale).toEqual([])
  })
})

describe('the production build', () => {
  it('carries no development-only Placeholder marker', () => {
    const offenders = builtFiles().filter(
      (file) => file.includes('data-placeholder') || file.includes('Placeholder:'),
    )
    expect(offenders).toHaveLength(0)
  })
})
