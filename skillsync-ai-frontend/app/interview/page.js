'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getInterviewQuestion, submitInterviewAnswer } from '@/lib/api';
import ScriptLine from '@/components/ScriptLine';
import Card from '@/components/Card';
import MockBanner from '@/components/MockBanner';

export default function InterviewPage() {
  const [started, setStarted] = useState(false);
  const [role, setRole] = useState('Frontend Engineer');
  const [difficulty, setDifficulty] = useState('Medium');

  const [history, setHistory] = useState([]); // [{question, answerText, feedback}]
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [phase, setPhase] = useState('loading-question'); // loading-question | answering | scoring | done

  async function startSession() {
    setStarted(true);
    setPhase('loading-question');
    const q = await getInterviewQuestion({ role, difficulty, excludeIds: [] });
    setCurrentQuestion(q);
    setPhase(q ? 'answering' : 'done');
  }

  async function handleSubmitAnswer() {
    if (!answerDraft.trim() || !currentQuestion) return;
    setPhase('scoring');
    const feedback = await submitInterviewAnswer({
      questionId: currentQuestion.id,
      answerText: answerDraft,
    });

    const completedTurn = { question: currentQuestion, answerText: answerDraft, feedback };
    const nextHistory = [...history, completedTurn];
    setHistory(nextHistory);
    setAnswerDraft('');

    const excludeIds = nextHistory.map((turn) => turn.question.id);
    const nextQuestion = await getInterviewQuestion({ role, difficulty, excludeIds });
    setCurrentQuestion(nextQuestion);
    setPhase(nextQuestion ? 'answering' : 'done');
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <MockBanner />
        <h1 className="font-display text-3xl mb-2">Mock Interview</h1>
        <p className="text-slate mb-8">
          Set the scene, then answer as you would in the real room. Each
          answer gets scored before the next question comes up.
        </p>
        <Card>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wide text-slate mb-1.5 block">
                Target role
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper text-sm"
              >
                <option>Frontend Engineer</option>
                <option>Backend Engineer</option>
                <option>Product Manager</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wide text-slate mb-1.5 block">
                Difficulty
              </span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper text-sm"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
          </div>
          <button
            onClick={startSession}
            className="bg-amber text-ink px-6 py-3 rounded-sm font-medium hover:bg-amber/90 transition-colors"
          >
            Cue the room
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <MockBanner />
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-display text-3xl">Mock Interview</h1>
        <span className="text-xs font-mono text-slate">{role} · {difficulty}</span>
      </div>

      <Card className="mb-6">
        {history.map((turn, i) => (
          <div key={turn.question.id}>
            <ScriptLine cueNumber={i * 2 + 1} speaker="Coach">
              {turn.question.text}
            </ScriptLine>
            <ScriptLine cueNumber={i * 2 + 2} speaker="You">
              {turn.answerText}
            </ScriptLine>
            <div className="ml-14 mb-4 -mt-2 text-sm bg-paperdim rounded-sm p-3">
              <span className="font-mono text-xs text-teal mr-2">Score {turn.feedback.score}</span>
              <span className="text-ink">{turn.feedback.improvements[0]}</span>
            </div>
          </div>
        ))}

        {phase === 'loading-question' ? (
          <p className="text-sm text-slate py-4">Pulling the next question…</p>
        ) : null}

        {currentQuestion && (phase === 'answering' || phase === 'scoring') ? (
          <>
            <ScriptLine cueNumber={history.length * 2 + 1} speaker="Coach">
              {currentQuestion.text}
            </ScriptLine>
            <div className="ml-14">
              <textarea
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                disabled={phase === 'scoring'}
                placeholder="Answer as you would out loud — situation, action, result."
                rows={5}
                className="w-full border border-ink/15 rounded-sm p-3 text-sm font-body mb-3 disabled:opacity-50"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!answerDraft.trim() || phase === 'scoring'}
                className="bg-amber text-ink px-5 py-2.5 rounded-sm font-medium disabled:opacity-40 hover:bg-amber/90 transition-colors"
              >
                {phase === 'scoring' ? 'Scoring…' : 'Deliver answer'}
              </button>
            </div>
          </>
        ) : null}

        {phase === 'done' ? (
          <div className="py-6 text-center">
            <p className="font-display text-xl mb-3">Session complete</p>
            <p className="text-sm text-slate mb-5">
              You answered {history.length} question{history.length === 1 ? '' : 's'} this session.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-amber text-ink px-5 py-2.5 rounded-sm font-medium hover:bg-amber/90 transition-colors"
            >
              See your progress
            </Link>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
