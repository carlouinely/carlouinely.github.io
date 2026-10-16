/**
 * The MDX pipeline runs this after `rehype-slug`, so every heading already
 * carries a stable `id`. It exports the level-2 headings as `outline`, which the
 * content loader reads to build a Case Study's table of contents.
 *
 * Deriving the outline from the slugged tree, rather than from the raw source,
 * is what keeps a table of contents entry and the heading it points at from
 * drifting apart: both come from the same id.
 */

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
  data?: { estree?: unknown }
}

type EstreeNode = Record<string, unknown>

/** One entry in a Case Study's table of contents: a level-2 heading's id and text. */
export type CaseStudyHeading = {
  id: string
  text: string
}

function headingText(node: HastNode): string {
  if (node.type === 'text') return node.value ?? ''
  return (node.children ?? []).map(headingText).join('')
}

/** The level-2 headings of a slugged tree, in document order. */
function outlineOf(tree: HastNode): CaseStudyHeading[] {
  const outline: CaseStudyHeading[] = []

  const walk = (node: HastNode) => {
    if (node.type === 'element' && node.tagName === 'h2') {
      const id = node.properties?.id
      if (typeof id === 'string') outline.push({ id, text: headingText(node) })
    }
    for (const child of node.children ?? []) walk(child)
  }

  walk(tree)
  return outline
}

/** The `{ id, text }` object ESTree the outline export is built from. */
function headingExpression(heading: CaseStudyHeading): EstreeNode {
  const property = (name: string, value: string): EstreeNode => ({
    type: 'Property',
    kind: 'init',
    method: false,
    computed: false,
    shorthand: false,
    key: { type: 'Identifier', name },
    value: { type: 'Literal', value },
  })

  return {
    type: 'ObjectExpression',
    properties: [property('id', heading.id), property('text', heading.text)],
  }
}

/**
 * Export the level-2 heading outline as `outline`.
 *
 * Pair with `rehype-slug` and run this after it.
 */
export function rehypeOutline() {
  return (tree: HastNode) => {
    const outline = outlineOf(tree)
    const children = (tree.children ??= [])

    children.unshift({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'outline' },
                    init: {
                      type: 'ArrayExpression',
                      elements: outline.map(headingExpression),
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    })
  }
}
