'use client';

import { useState } from 'react';
import { uploadResume } from '@/lib/api';
import Card from '@/components/Card';
import ScoreBadge from '@/components/ScoreBadge';
import MockBanner from '@/components/MockBanner';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | analyzing | done | error
  const [analysis, setAnalysis] = useState(null);

  async function handleAnalyze() {
    if (!file) return;
    setStatus('analyzing');
    try {
      const result = await uploadResume(file);
      setAnalysis(result);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <MockBanner />
      <h1 className="font-display text-3xl mb-2">Resume Analysis</h1>
      <p className="text-slate mb-8">
        Upload a resume to see how it would read to an ATS, plus specific
        fixes before you send it out.
      </p>

      <Card className="mb-8">
        <label
          htmlFor="resume-upload"
          className="block border-2 border-dashed border-ink/20 rounded-sm p-10 text-center cursor-pointer hover:border-amber/60 transition-colors"
        >
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="font-body text-sm text-ink mb-1">
            {file ? file.name : 'Click to choose a resume (PDF or Word)'}
          </p>
          <p className="text-xs text-slate">or drag a file in</p>
        </label>

        <button
          onClick={handleAnalyze}
          disabled={!file || status === 'analyzing'}
          className="mt-6 w-full bg-amber text-ink py-3 rounded-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber/90 transition-colors"
        >
          {status === 'analyzing' ? 'Analyzing…' : 'Analyze resume'}
        </button>

        {status === 'error' ? (
          <p className="mt-4 text-coral text-sm">
            Something went wrong reaching the analysis service. Try again.
          </p>
        ) : null}
      </Card>

      {analysis ? (
        <Card title="Results">
          <div className="flex items-start gap-8 mb-6">
            <ScoreBadge score={analysis.atsScore} label="ATS Score" size="lg" />
            <div className="flex-1 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wide text-teal mb-2">
                  Strengths
                </h4>
                <ul className="text-sm text-ink space-y-1.5">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wide text-coral mb-2">
                  Weaknesses
                </h4>
                <ul className="text-sm text-ink space-y-1.5">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="leading-relaxed">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-slate mb-2">
              Suggested fixes
            </h4>
            <ul className="text-sm text-ink space-y-1.5 list-disc list-inside">
              {analysis.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
