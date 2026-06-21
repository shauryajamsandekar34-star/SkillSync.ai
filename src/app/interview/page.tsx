'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function InterviewPage() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    startInterview()
  }, [])

  async function startInterview() {
    setLoading(true)
    try {
      const sessionId = localStorage.getItem('sessionId') || ''
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()
      if (data.success) {
        setQuestions(data.questions)
      } else {
        setError(data.error || 'Failed to load interview')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleNext() {
    if (!answer.trim()) return

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)
    setAnswer('')

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Last question — call evaluate API
      setSubmitting(true)
      try {
        const sessionId = Date.now().toString()
        const questionTexts = questions.map((q: any) => q.question)
        const jobRole = localStorage.getItem('jobRole') || 'Software Engineer'

        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            jobRole,
            questions: questionTexts,
            answers: newAnswers,
          }),
        })

        const data = await res.json()

        if (data.success) {
          window.location.href = `/results?resultId=${data.resultId}`
        } else {
          setError('Evaluation failed. Please try again.')
          setSubmitting(false)
        }
      } catch (err) {
        setError('Something went wrong during evaluation.')
        setSubmitting(false)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🤖</div>
          <p className="text-gray-600 font-medium">Analyzing your resume...</p>
          <p className="text-gray-400 text-sm">Generating personalized questions</p>
        </div>
      </main>
    )
  }

  // Submitting state
  if (submitting) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Evaluating your answers...</p>
          <p className="text-gray-400 text-sm">This may take a few seconds</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-4xl">❌</div>
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.href = '/'}>
              Go back and upload resume
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">

        {/* Progress */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant={currentQuestion?.type === 'technical' ? 'default' : 'secondary'}>
                {currentQuestion?.type}
              </Badge>
            </div>
            <CardTitle className="text-lg mt-2">
              {currentQuestion?.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <Button
              onClick={handleNext}
              disabled={!answer.trim() || submitting}
              className="w-full"
            >
              {currentIndex + 1 === questions.length ? 'Finish & Get Results 🎯' : 'Next Question →'}
            </Button>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}