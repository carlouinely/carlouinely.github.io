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
      className="rounded-pills bg-ember px-24 py-12 font-dm-sans text-body text-obsidian disabled:cursor-not-allowed disabled:opacity-60"
    >
      Download CV
    </button>
  )
}
