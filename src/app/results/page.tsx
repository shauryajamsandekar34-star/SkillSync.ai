"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Evaluation {
  questionIndex: number;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface LearningResource {
  topic: string;
  reason: string;
  suggestions: string[];
}

interface Result {
  jobRole: string;
  overallScore: number;
  summary: string;
  topStrengths: string[];
  topImprovements: string[];
  recommendation: string;
  evaluations: Evaluation[];
  learningPlan: {
    resources: LearningResource[];
    practiceQuestions: string[];
    weeklyPlan: string;
  };
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resultId) {
      setError("No result ID provided.");
      setLoading(false);
      return;
    }

    fetch(`/api/evaluate?resultId=${resultId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setResult(data.result);
        else setError("Could not load results.");
      })
      .catch(() => setError("Failed to fetch results."))
      .finally(() => setLoading(false));
  }, [resultId]);

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const recommendationColor = (rec: string) => {
    if (rec === "Strong Hire") return "bg-green-100 text-green-800";
    if (rec === "Hire") return "bg-blue-100 text-blue-800";
    if (rec === "Maybe") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 underline">Go Home</Link>
        </div>
      </div>
    );

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Interview Results</h1>
          <p className="text-gray-500 mt-1">Role: <span className="font-medium">{result.jobRole}</span></p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-500 mb-1">Overall Score</p>
          <p className={`text-6xl font-bold ${scoreColor(result.overallScore)}`}>
            {result.overallScore}<span className="text-2xl text-gray-400">/10</span>
          </p>
          <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${recommendationColor(result.recommendation)}`}>
            {result.recommendation}
          </span>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">{result.summary}</p>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-2xl p-5">
            <h2 className="font-semibold text-green-800 mb-3">✅ Top Strengths</h2>
            <ul className="space-y-2">
              {result.topStrengths.map((s, i) => (
                <li key={i} className="text-green-700 text-sm">• {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-50 rounded-2xl p-5">
            <h2 className="font-semibold text-orange-800 mb-3">🎯 Areas to Improve</h2>
            <ul className="space-y-2">
              {result.topImprovements.map((s, i) => (
                <li key={i} className="text-orange-700 text-sm">• {s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Per-Question Breakdown */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Question Breakdown</h2>
          <div className="space-y-6">
            {result.evaluations.map((ev, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-700 text-sm flex-1 pr-4">Q{i + 1}: {ev.question}</p>
                  <span className={`text-xl font-bold ${scoreColor(ev.score)}`}>{ev.score}/10</span>
                </div>
                <p className="text-gray-500 text-xs mb-2 italic">Your answer: {ev.answer || "No answer"}</p>
                <p className="text-gray-600 text-sm mb-3">{ev.feedback}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {ev.strengths.length > 0 && (
                    <div>
                      <p className="font-semibold text-green-700 mb-1">Strengths</p>
                      {ev.strengths.map((s, j) => <p key={j} className="text-green-600">• {s}</p>)}
                    </div>
                  )}
                  {ev.improvements.length > 0 && (
                    <div>
                      <p className="font-semibold text-orange-700 mb-1">Improvements</p>
                      {ev.improvements.map((s, j) => <p key={j} className="text-orange-600">• {s}</p>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Plan */}
        {result.learningPlan && (
          <div className="bg-blue-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">📚 Your Learning Plan</h2>
            <p className="text-blue-700 text-sm mb-4">{result.learningPlan.weeklyPlan}</p>
            <div className="space-y-4">
              {result.learningPlan.resources.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-gray-800">{r.topic}</p>
                  <p className="text-gray-500 text-xs mb-2">{r.reason}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {r.suggestions.map((s, j) => <li key={j}>• {s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            {result.learningPlan.practiceQuestions.length > 0 && (
              <div className="mt-4 bg-white rounded-xl p-4">
                <p className="font-semibold text-gray-800 mb-2">Practice Questions</p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  {result.learningPlan.practiceQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center pb-10">
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
            New Interview
          </Link>
          <Link href="/history" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-300">
            View History
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}