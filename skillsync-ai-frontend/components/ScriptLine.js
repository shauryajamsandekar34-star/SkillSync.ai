/**
 * ScriptLine — the page's signature device.
 *
 * Interview practice is rendered like a rehearsal script: each turn gets a
 * cue number (like a teleprompter) and a speaker label. "Coach" turns sit in
 * teal, "You" turns sit in paper/ink. Reused on the interview page and in
 * feedback summaries so the whole product reads as one continuous script.
 */
export default function ScriptLine({ cueNumber, speaker, children, meta }) {
  const isCoach = speaker === 'Coach';

  return (
    <div className="flex gap-4 py-4 border-b border-ink/8 last:border-b-0">
      <div className="w-10 flex-shrink-0 text-right pt-1">
        <span className="cue-number">{String(cueNumber).padStart(2, '0')}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-1">
          <span
            className={
              isCoach
                ? 'text-teal text-xs font-mono uppercase tracking-wide font-medium'
                : 'text-ink text-xs font-mono uppercase tracking-wide font-medium'
            }
          >
            {speaker}
          </span>
          {meta ? (
            <span className="text-xs font-mono text-slate">{meta}</span>
          ) : null}
        </div>
        <div className="font-body text-[15px] leading-relaxed text-ink">
          {children}
        </div>
      </div>
    </div>
  );
}
