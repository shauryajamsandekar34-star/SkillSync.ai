import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { evaluateAnswers } from "@/lib/agents/evaluationAgent";
import { generateLearningPlan } from "@/lib/agents/learningAgent";
import mongoose from "mongoose";
const InterviewResultSchema = new mongoose.Schema({
  sessionId: String,
  jobRole: String,
  questions: [String],
  answers: [String],
  evaluations: Array,
  overallScore: Number,
  summary: String,
  topStrengths: [String],
  topImprovements: [String],
  recommendation: String,
  learningPlan: Object,
  createdAt: { type: Date, default: Date.now },
});

const InterviewResult =
  mongoose.models.InterviewResult ||
  mongoose.model("InterviewResult", InterviewResultSchema);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, jobRole, questions, answers } = body;

    if (!questions || !answers || !jobRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Run evaluation
    const evaluation = await evaluateAnswers(questions, answers, jobRole);

    // Generate learning plan
    const learningPlan = await generateLearningPlan(
      jobRole,
      evaluation.topImprovements,
      evaluation.overallScore
    );

    // Save to MongoDB
    await connectDB();
    const result = await InterviewResult.create({
      sessionId,
      jobRole,
      questions,
      answers,
      evaluations: evaluation.evaluations,
      overallScore: evaluation.overallScore,
      summary: evaluation.summary,
      topStrengths: evaluation.topStrengths,
      topImprovements: evaluation.topImprovements,
      recommendation: evaluation.recommendation,
      learningPlan,
    });

    return NextResponse.json({
      success: true,
      resultId: result._id.toString(),
      evaluation,
      learningPlan,
    });
  } catch (error) {
    console.error("Evaluate error:", error);
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get("resultId");

    if (!resultId) {
      return NextResponse.json({ error: "Missing resultId" }, { status: 400 });
    }

    const result = await InterviewResult.findById(resultId);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Get result error:", error);
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 });
  }
}