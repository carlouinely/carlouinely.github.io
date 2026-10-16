export type MediaKind = 'halftone' | 'ember' | 'image' | 'video'

export type MediaRatio = `${number} / ${number}`

export type MediaProps = {
  /**
   * The final kind of the asset. With no `src`, it selects the Placeholder
   * treatment; with a `src`, `video` renders a video and everything else an image.
   */
  kind: MediaKind
  ratio: MediaRatio
  /**
   * The real asset URL. Adding it is the only edit needed to replace the
   * Placeholder with the real asset; `kind` already names the final media.
   */
  src?: string
  /** Names the asset for screen readers and the development caption. */
  label: string
}

function placeholderTreatment(kind: MediaKind): string {
  return kind === 'ember' ? 'bg-ember' : 'media-halftone'
}

/**
 * The only way an image or video reaches the page. An absent `src` renders a
 * design-native Placeholder at the requested ratio and card radius; a present
 * `src` renders the real element. The Placeholder is always labelled for screen
 * readers, and in development only it also carries a dotted border and a 12px
 * caption naming the asset it stands in for.
 */
export function Media({ kind, ratio, src, label }: MediaProps) {
  const shape = { aspectRatio: ratio }

  if (src) {
    if (kind === 'video') {
      return (
        <video
          className="w-full rounded-cards object-cover"
          style={shape}
          src={src}
          controls
          aria-label={label}
        />
      )
    }

    return <img className="w-full rounded-cards object-cover" style={shape} src={src} alt={label} />
  }

  const block = (
    <div
      className={`w-full rounded-cards ${placeholderTreatment(kind)}`}
      style={shape}
      role="img"
      aria-label={label}
    />
  )

  // Development builds mark every Placeholder so the owner can see at a glance
  // what is not real. Production ships neither the border nor the caption.
  if (!import.meta.env.DEV) return block

  return (
    <figure
      className="rounded-cards border-[1.5px] border-dotted border-obsidian p-4"
      data-placeholder
    >
      {block}
      <figcaption className="mt-8 font-system-sans-serif text-caption">
        Placeholder: {label}
      </figcaption>
    </figure>
  )
}
