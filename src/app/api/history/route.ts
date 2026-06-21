import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import mongoose from "mongoose";

const InterviewResultSchema = new mongoose.Schema({
  sessionId: String,
  jobRole: String,
  overallScore: Number,
  recommendation: String,
  createdAt: { type: Date, default: Date.now },
});

const InterviewResult =
  mongoose.models.InterviewResult ||
  mongoose.model("InterviewResult", InterviewResultSchema);

export async function GET() {
  try {
    await connectDB();
    const results = await InterviewResult.find({})
      .sort({ createdAt: -1 })
      .select("jobRole overallScore recommendation createdAt")
      .limit(20);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}