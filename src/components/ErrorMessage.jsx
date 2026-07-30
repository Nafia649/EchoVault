/**
 * ErrorMessage
 *
 * Inline error banner for surfacing API failure notices.
 * Styled to match the existing dark aesthetic using rose accent tones.
 * Does not manage its own state — purely presentational.
 *
 * Props:
 *   message (string) — the error text to display
 */
export default function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/30
                 bg-rose-500/10 px-5 py-4 text-sm text-rose-300"
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-rose-400">
        ⚠
      </span>
      <p>{message}</p>
    </div>
  );
}
