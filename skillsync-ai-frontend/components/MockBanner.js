'use client';

import { usingMockApi } from '@/lib/api';

export default function MockBanner() {
  if (!usingMockApi) return null;
  return (
    <div className="bg-amber/15 border border-amber/40 text-ink text-xs font-mono px-4 py-2 rounded-sm mb-6 inline-block">
      Running on mock data — set NEXT_PUBLIC_API_BASE_URL in .env.local once the backend is live
    </div>
  );
}
