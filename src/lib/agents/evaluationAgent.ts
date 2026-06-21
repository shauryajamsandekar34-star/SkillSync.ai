import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface EvaluationResult {
  questionIndex: number;
  question: string;
  answer: string;
  score: number; // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface OverallEvaluation {
  evaluations: EvaluationResult[];
  overallScore: number;
  summary: string;
  topStrengths: string[];
  topImprovements: string[];
  recommendation: string;
}

export async function evaluateAnswers(
  questions: string[],
  answers: string[],
  jobRole: string
): Promise<OverallEvaluation> {
  const evaluations: EvaluationResult[] = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answer = answers[i] || "No answer provided";

    const prompt = `You are an expert interview coach evaluating a candidate for a ${jobRole} position.

Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and respond ONLY with a JSON object in this exact format:
{
  "score": <number from 0-10>,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";

    try {
      const cleaned = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      evaluations.push({
        questionIndex: i,
        question,
        answer,
        score: parsed.score ?? 5,
        feedback: parsed.feedback ?? "No feedback available.",
        strengths: parsed.strengths ?? [],
        improvements: parsed.improvements ?? [],
      });
    } catch {
      evaluations.push({
        questionIndex: i,
        question,
        answer,
        score: 5,
        feedback: "Could not evaluate this answer.",
        strengths: [],
        improvements: [],
      });
    }
  }

  const overallScore =
    evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;

  const summaryPrompt = `You are an expert interview coach. A candidate for a ${jobRole} role completed an interview and scored ${overallScore.toFixed(1)}/10 overall.

Based on this performance, respond ONLY with a JSON object:
{
  "summary": "<3-4 sentence overall performance summary>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "recommendation": "<one of: 'Strong Hire', 'Hire', 'Maybe', 'No Hire'>"
}`;

  const summaryResponse = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: summaryPrompt }],
    temperature: 0.3,
  });

  const summaryContent =
    summaryResponse.choices[0]?.message?.content || "{}";

  let summary = "Interview completed.";
  let topStrengths: string[] = [];
  let topImprovements: string[] = [];
  let recommendation = "Maybe";

  try {
    const cleaned = summaryContent.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    summary = parsed.summary ?? summary;
    topStrengths = parsed.topStrengths ?? [];
    topImprovements = parsed.topImprovements ?? [];
    recommendation = parsed.recommendation ?? recommendation;
  } catch {
    // use defaults
  }

  return {
    evaluations,
    overallScore: parseFloat(overallScore.toFixed(1)),
    summary,
    topStrengths,
    topImprovements,
    recommendation,
  };
}