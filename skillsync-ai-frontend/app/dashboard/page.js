'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { getDashboardStats } from '@/lib/api';
import Card from '@/components/Card';
import ScoreBadge from '@/components/ScoreBadge';
import MockBanner from '@/components/MockBanner';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <MockBanner />
        <p className="text-sm text-slate">Loading your progress…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <MockBanner />
      <h1 className="font-display text-3xl mb-2">Progress Dashboard</h1>
      <p className="text-slate mb-8">
        How your answers have trended across every session.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <ScoreBadge score={stats.averageScore} label="Avg score" />
            <div>
              <p className="font-display text-2xl">{stats.averageScore}</p>
              <p className="text-xs text-slate">average answer score</p>
            </div>
          </div>
        </Card>
        <Card>
          <p className="font-display text-2xl">{stats.sessionsCompleted}</p>
          <p className="text-xs text-slate">sessions completed</p>
        </Card>
        <Card>
          <p className="font-display text-2xl">
            {stats.scoreHistory[stats.scoreHistory.length - 1]?.score ?? '—'}
          </p>
          <p className="text-xs text-slate">most recent session score</p>
        </Card>
      </div>

      <Card title="Score trend" className="mb-8">
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={stats.scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(19,21,26,0.08)" vertical={false} />
              <XAxis
                dataKey="session"
                tickFormatter={(v) => `S${v}`}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 2, border: '1px solid rgba(19,21,26,0.1)' }}
              />
              <Line type="monotone" dataKey="score" stroke="#E8A33D" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card title="Consistent strengths">
          <ul className="text-sm text-ink space-y-1.5">
            {stats.strengthAreas.map((s, i) => (
              <li key={i} className="leading-relaxed">{s}</li>
            ))}
          </ul>
        </Card>
        <Card title="Keeps coming up">
          <ul className="text-sm text-ink space-y-1.5">
            {stats.weakAreas.map((w, i) => (
              <li key={i} className="leading-relaxed">{w}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
