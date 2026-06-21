import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const formData = await req.formData()
    const file = formData.get('resume') as File
    const sessionId = formData.get('sessionId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let rawText = ''
    try {
      const pdfParse = require('pdf-parse')
      const pdfData = await pdfParse(buffer)
      rawText = pdfData.text
    } catch (e) {
      rawText = 'PDF text extraction failed'
    }

    const user = await User.findOneAndUpdate(
      { sessionId },
      { sessionId, 'resumeData.rawText': rawText },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      textLength: rawText.length,
      userId: user._id,
    })

  } catch (error: any) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process resume' },
      { status: 500 }
    )
  }
}