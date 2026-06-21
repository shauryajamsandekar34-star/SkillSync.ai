import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface LearningResource {
  topic: string;
  reason: string;
  suggestions: string[];
}

export interface LearningPlan {
  resources: LearningResource[];
  practiceQuestions: string[];
  weeklyPlan: string;
}

export async function generateLearningPlan(
  jobRole: string,
  topImprovements: string[],
  overallScore: number
): Promise<LearningPlan> {
  const prompt = `You are a career coach helping a candidate improve for a ${jobRole} interview.
Their overall score was ${overallScore}/10.
Areas needing improvement: ${topImprovements.join(", ")}

Create a personalized learning plan. Respond ONLY with a JSON object:
{
  "resources": [
    {
      "topic": "<topic name>",
      "reason": "<why this topic matters>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
    }
  ],
  "practiceQuestions": [
    "<practice question 1>",
    "<practice question 2>",
    "<practice question 3>"
  ],
  "weeklyPlan": "<a 2-3 sentence weekly study plan>"
}

Include 3 resources and 3 practice questions.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content || "{}";

  try {
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      resources: parsed.resources ?? [],
      practiceQuestions: parsed.practiceQuestions ?? [],
      weeklyPlan: parsed.weeklyPlan ?? "Focus on the areas listed above.",
    };
  } catch {
    return {
      resources: [],
      practiceQuestions: [],
      weeklyPlan: "Review your weak areas and practice regularly.",
    };
  }
}