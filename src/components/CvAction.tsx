/**
 * The CV action, in its final position but inert until a redacted PDF exists.
 * It renders as a disabled control: it is not focusable, cannot be activated,
 * and references no CV file, so it does not present itself as usable.
 *
 * TODO(placeholder:cv-action): publish a redacted CV, then turn this into a real link.
 * See PLACEHOLDERS.md.
 */
export function CvAction() {
  return (
    <button
      type="button"
      disabled
      className="shrink-0 whitespace-nowrap rounded-pills bg-ember px-16 py-10 font-dm-sans text-body text-obsidian disabled:cursor-not-allowed disabled:opacity-60 md:px-24 md:py-12"
    >
      Download CV
    </button>
  )
}
