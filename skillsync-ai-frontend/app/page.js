import Link from 'next/link';
import ScriptLine from '@/components/ScriptLine';
import Card from '@/components/Card';

export default function HomePage() {
  return (
    <>
      {/* Hero — the stage, before the audience arrives */}
      <section className="bg-ink text-paper relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 600px 400px at 75% 0%, rgba(232,163,61,0.18), transparent 70%)',
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-24 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-amber mb-4">
              SkillSync AI
            </p>
            <h1 className="font-display text-5xl leading-tight mb-6">
              Rehearse the room
              <br />
              before you walk in.
            </h1>
            <p className="text-paper/70 text-lg mb-8 max-w-md">
              Upload your resume, run real interview questions with an AI coach,
              and watch your answers get sharper across every session.
            </p>
            <div className="flex gap-4">
              <Link
                href="/interview"
                className="bg-amber text-ink px-6 py-3 rounded-sm font-medium hover:bg-amber/90 transition-colors"
              >
                Start a mock interview
              </Link>
              <Link
                href="/resume"
                className="border border-paper/30 px-6 py-3 rounded-sm font-medium hover:bg-paper/5 transition-colors"
              >
                Analyze my resume
              </Link>
            </div>
          </div>

          {/* Signature element: a preview of the script the product is built on */}
          <div className="bg-inksoft border border-paper/10 rounded-sm p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-4">
              Session 8 — in progress
            </p>
            <div className="[&_.cue-number]:text-paper/40 [&_span.text-ink]:text-paper [&_span.text-teal]:text-amber">
              <ScriptLine cueNumber={1} speaker="Coach">
                Tell me about a time you had to optimize a slow-loading page.
              </ScriptLine>
              <ScriptLine cueNumber={2} speaker="You" meta="62 sec">
                Our checkout page was taking 4 seconds to interact. I profiled
                it, found an unbundled chart library, and lazy-loaded it...
              </ScriptLine>
            </div>
          </div>
        </div>
      </section>

      {/* What the room is set up for */}
      <section className="bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
          <Card title="Resume Analysis">
            <p className="text-sm text-slate leading-relaxed">
              Upload a resume and get an ATS-style score, plus what to fix
              before it ever reaches a recruiter.
            </p>
          </Card>
          <Card title="Mock Interview">
            <p className="text-sm text-slate leading-relaxed">
              Answer real questions for your target role. Each answer gets
              scored with specific notes, not just a pass or fail.
            </p>
          </Card>
          <Card title="Progress Dashboard">
            <p className="text-sm text-slate leading-relaxed">
              See your score trend across sessions, and which areas keep
              coming up as strengths or sticking points.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
