// Project content lives in root `projects/*.mdx`, outside `src` (see docs/adr/0002).
declare module '~projects/*.mdx' {
  import type { ComponentType } from 'react'
  const MDXComponent: ComponentType<Record<string, unknown>>
  export default MDXComponent
}
