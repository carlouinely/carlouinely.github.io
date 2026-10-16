import { MountainGlyph } from '~src/components/glyphs'
import { site } from '~src/site'

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-page px-24 pb-40 pt-80">
      <div className="border-t-[1.5px] border-dotted border-obsidian" />
      <div className="mt-24 flex flex-wrap items-center justify-between gap-16 font-system-sans-serif text-caption text-obsidian">
        <span className="flex items-center gap-8 font-dm-sans text-body">
          <MountainGlyph />
          {site.wordmark}
        </span>
        <span>
          © {new Date().getFullYear()} {site.wordmark}
        </span>
        <span>Built with TanStack Start, React, and Vite+.</span>
      </div>
    </footer>
  )
}
