"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryItem {
  _id: string;
  jobRole: string;
  overallScore: number;
  recommendation: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setHistory(data.results);
      })
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Interview History</h1>
          <Link href="/" className="text-blue-600 text-sm hover:underline">← Home</Link>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-500">Loading history...</div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No interviews yet.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl">Start an Interview</Link>
          </div>
        )}

        <div className="space-y-4">
          {history.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{item.jobRole}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
                <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${recommendationColor(item.recommendation)}`}>
                  {item.recommendation}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${scoreColor(item.overallScore)}`}>
                  {item.overallScore}/10
                </span>
                <Link
                  href={`/results?resultId=${item._id}`}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}