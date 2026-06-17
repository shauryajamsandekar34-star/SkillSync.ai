// Mock data only. Replace with real backend responses once your teammate's
// API is live — nothing in here is imported anywhere except lib/api.js.

export const mockResumeAnalysis = {
  atsScore: 78,
  strengths: [
    'Quantified impact in 3 of 5 bullet points (e.g. "cut deploy time 40%")',
    'Skills section matches common ATS keyword parsing patterns',
    'Consistent reverse-chronological format',
  ],
  weaknesses: [
    'No measurable outcome in the most recent role\'s first bullet',
    'Job title casing is inconsistent across entries',
  ],
  suggestions: [
    'Lead each bullet with the result, then the action that produced it',
    'Add a one-line summary at the top targeting the specific role',
    'Remove the objective paragraph — recruiters skip it',
  ],
};

export const mockQuestionBank = [
  {
    id: 'q1',
    role: 'Frontend Engineer',
    difficulty: 'Medium',
    text: 'Tell me about a time you had to optimize a slow-loading page. What was your process?',
  },
  {
    id: 'q2',
    role: 'Frontend Engineer',
    difficulty: 'Medium',
    text: 'Walk me through how you would structure state for a multi-step form.',
  },
  {
    id: 'q3',
    role: 'Frontend Engineer',
    difficulty: 'Hard',
    text: 'Describe a disagreement you had with a teammate about a technical approach. How was it resolved?',
  },
  {
    id: 'q4',
    role: 'Frontend Engineer',
    difficulty: 'Easy',
    text: 'What does it mean for a website to be accessible, and how do you check for it?',
  },
];

export function mockFeedbackFor(answerText) {
  // A crude stand-in scorer so the UI has something to react to.
  // The real backend should replace this with an actual LLM-graded response.
  const length = answerText.trim().length;
  const score = length > 400 ? 88 : length > 150 ? 72 : 48;
  return {
    score,
    strengths:
      score >= 70
        ? ['Answer follows a clear situation → action → result shape']
        : ['Attempted to give a concrete example'],
    improvements:
      score >= 70
        ? ['Could close with the long-term impact of the result']
        : [
            'Add a specific situation rather than a general statement',
            'Name the concrete action you took, step by step',
          ],
    idealAnswerNotes:
      'Strong answers name the situation in one sentence, the specific action taken, and a measurable result.',
  };
}

export const mockDashboardStats = {
  sessionsCompleted: 12,
  averageScore: 74,
  scoreHistory: [
    { session: 1, score: 52 },
    { session: 2, score: 58 },
    { session: 3, score: 61 },
    { session: 4, score: 65 },
    { session: 5, score: 70 },
    { session: 6, score: 68 },
    { session: 7, score: 74 },
    { session: 8, score: 79 },
  ],
  strengthAreas: ['Structuring answers (STAR method)', 'Technical depth'],
  weakAreas: ['Closing with measurable impact', 'Conciseness under 90 seconds'],
};
