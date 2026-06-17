/**
 * lib/api.js — the seam between frontend and backend.
 *
 * Every page imports from here, never calls fetch() directly. That means
 * the day your teammate's backend is ready, you flip ONE thing — set
 * NEXT_PUBLIC_API_BASE_URL in .env.local — and every page starts hitting
 * the real API with zero changes to page code.
 *
 * The exact request/response shapes each function expects are documented
 * in API_CONTRACT.md at the project root. Share that file with your
 * teammate — it's the agreement both sides are building against.
 */

import {
  mockResumeAnalysis,
  mockQuestionBank,
  mockFeedbackFor,
  mockDashboardStats,
} from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USE_MOCKS = !BASE_URL;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  return res.json();
}

// --- Resume analysis -------------------------------------------------
// Contract: POST /api/resume/upload (multipart/form-data, field "resume")
export async function uploadResume(file) {
  if (USE_MOCKS) {
    await delay(900);
    return mockResumeAnalysis;
  }
  const formData = new FormData();
  formData.append('resume', file);
  const res = await fetch(`${BASE_URL}/api/resume/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Resume upload failed (${res.status})`);
  return res.json();
}

// --- Mock interview ----------------------------------------------------
// Contract: GET /api/interview/question?role=&difficulty=&exclude=id1,id2
export async function getInterviewQuestion({ role, difficulty, excludeIds = [] } = {}) {
  if (USE_MOCKS) {
    await delay(500);
    const remaining = mockQuestionBank.filter((q) => !excludeIds.includes(q.id));
    return remaining[0] ?? null;
  }
  const params = new URLSearchParams({
    role: role ?? '',
    difficulty: difficulty ?? '',
    exclude: excludeIds.join(','),
  });
  return request(`/api/interview/question?${params.toString()}`);
}

// Contract: POST /api/interview/answer  { questionId, answerText }
export async function submitInterviewAnswer({ questionId, answerText }) {
  if (USE_MOCKS) {
    await delay(800);
    return mockFeedbackFor(answerText);
  }
  return request('/api/interview/answer', {
    method: 'POST',
    body: JSON.stringify({ questionId, answerText }),
  });
}

// --- Dashboard -----------------------------------------------------------
// Contract: GET /api/dashboard/progress
export async function getDashboardStats() {
  if (USE_MOCKS) {
    await delay(600);
    return mockDashboardStats;
  }
  return request('/api/dashboard/progress');
}

export const usingMockApi = USE_MOCKS;
