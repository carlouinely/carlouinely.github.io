/**
 * The CV action, in its final position but inert until a redacted PDF exists.
 * It renders as a disabled control: it is not focusable, cannot be activated,
 * and references no CV file, so it does not present itself as usable. It wears
 * the shared primary pill, so it is the same size wherever it appears.
 *
 * TODO(placeholder:cv-action): publish a redacted CV, then turn this into a real link.
 * See PLACEHOLDERS.md.
 *
 * `className` carries the caller's sizing and layout, so the one control stays
 * compact in the nav and stretches to the full row under the footer's ask.
 */
export function CvAction({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      disabled
      className={`action-pill action-pill--primary shrink-0 ${className}`}
    >
      Download CV
    </button>
  )
}
