import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import { extractResumeData } from '@/lib/agents/resumeAgent'
import { generateQuestions } from '@/lib/agents/interviewAgent'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { sessionId } = await req.json()

    const user = await User.findOne({ sessionId })

    if (!user || !user.resumeData?.rawText) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Step 1: Extract skills from resume using AI
    const resumeData = await extractResumeData(user.resumeData.rawText)

    // Step 2: Save extracted data to database
    await User.findOneAndUpdate(
      { sessionId },
      {
        'resumeData.skills': resumeData.skills,
        'resumeData.experience': resumeData.experience,
        'resumeData.projects': resumeData.projects,
      }
    )

    // Step 3: Generate questions based on resume + past weaknesses
    const questions = await generateQuestions(resumeData, user.weaknesses || [])

    // Step 4: Save questions to database
    await User.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          interviews: {
            date: new Date(),
            questions: questions.map((q: any) => q.question),
            answers: [],
          }
        }
      }
    )

    return NextResponse.json({
      success: true,
      resumeData,
      questions,
    })

  } catch (error: any) {
    console.error('Interview error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate interview' },
      { status: 500 }
    )
  }
}