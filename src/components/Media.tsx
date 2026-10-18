export type MediaKind = 'halftone' | 'ember' | 'image' | 'video'

export type MediaRatio = `${number} / ${number}`

/**
 * The corner radius step the block wears. Media at card and hero scale takes the
 * card radius; a compact thumbnail sharing that radius on a small box rounds
 * into a blob, so it steps down to the system's smaller radius instead.
 */
export type MediaRadius = 'cards' | 'medium' | 'small'

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
  /** Defaults to the card radius, which suits every block the size of a card. */
  radius?: MediaRadius
  /**
   * Extra classes for the media box itself, never for the development frame
   * around it. A caller's hover or entrance treatment belongs on the picture, so
   * the dotted border and caption marking a Placeholder stay still.
   */
  className?: string
}

const RADIUS_CLASS: Record<MediaRadius, string> = {
  cards: 'rounded-cards',
  medium: 'rounded-medium',
  small: 'rounded-small',
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
export function Media({ kind, ratio, src, label, radius = 'cards', className = '' }: MediaProps) {
  const corner = RADIUS_CLASS[radius]
  const shape = { aspectRatio: ratio }
  const box = `w-full ${corner} ${className}`.trimEnd()

  if (src) {
    if (kind === 'video') {
      return (
        <video
          className={`${box} object-cover`}
          style={shape}
          src={src}
          controls
          aria-label={label}
        />
      )
    }

    return <img className={`${box} object-cover`} style={shape} src={src} alt={label} />
  }

  const block = (
    <div
      className={`${box} ${placeholderTreatment(kind)}`}
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
      className={`${corner} border-[1.5px] border-dotted border-obsidian p-4`}
      data-placeholder
    >
      {block}
      <figcaption className="mt-8 font-system-sans-serif text-caption">
        Placeholder: {label}
      </figcaption>
    </figure>
  )
}
