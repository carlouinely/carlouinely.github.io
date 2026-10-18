import { ToolGlyph } from '~src/components/toolGlyphs'

export type StackListProps = {
  /** The tools a Project was built with, in the order content lists them. */
  stack: string[]
  /**
   * Type step and colour for the row. The names inherit it, so the same list
   * reads as a compact Index facet and as a Case Study fact without a variant.
   */
  className?: string
}

/**
 * The tools a Project was built with: each one's monochrome mark beside its
 * name, the name carrying the meaning and the mark decorative. A tool with no
 * mark of its own still reads, so a new tool never needs an icon to ship. The
 * Projects Index row, the Case Study's facts, and a role's credited Case Studies
 * all use it, which is what keeps one stack reading the same way wherever it
 * appears.
 */
export function StackList({ stack, className = '' }: StackListProps) {
  if (stack.length === 0) return null

  return (
    <ul
      className={`flex flex-wrap items-center gap-x-16 gap-y-8 font-dm-sans ${className}`.trimEnd()}
    >
      {stack.map((tool) => (
        <li key={tool} className="inline-flex items-center gap-4">
          <ToolGlyph tool={tool} className="size-[1.25em] shrink-0" />
          {tool}
        </li>
      ))}
    </ul>
  )
}
