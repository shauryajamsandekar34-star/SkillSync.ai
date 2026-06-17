/**
 * ScoreBadge — a circular score readout, color-coded by range.
 * Used for resume ATS score, per-answer scores, and dashboard averages.
 */
export default function ScoreBadge({ score, max = 100, label, size = 'md' }) {
  const pct = Math.max(0, Math.min(1, score / max));
  const tone = pct >= 0.75 ? 'text-teal' : pct >= 0.5 ? 'text-amber' : 'text-coral';
  const dims = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-16 h-16 text-xl';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${dims} rounded-full border-2 border-current ${tone} flex items-center justify-center font-display font-medium`}
      >
        {score}
      </div>
      {label ? (
        <span className="text-xs font-mono uppercase tracking-wide text-slate text-center">
          {label}
        </span>
      ) : null}
    </div>
  );
}
