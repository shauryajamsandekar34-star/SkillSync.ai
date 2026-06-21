'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function getSessionId() {
  let id = localStorage.getItem('sessionId')
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('sessionId', id)
  }
  return id
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [jobRole, setJobRole] = useState('')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload() {
    if (!file) return
    if (!jobRole.trim()) {
      setError('Please enter the job role you are applying for.')
      return
    }

    setUploading(true)
    setStatus('Uploading your resume...')
    setError('')

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('sessionId', getSessionId())

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        // Save jobRole to localStorage
        localStorage.setItem('jobRole', jobRole.trim())
        setStatus('Resume uploaded successfully!')
        setDone(true)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Job Role Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Job Role You're Applying For
          </label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer, Data Scientist..."
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null)
              setError('')
              setDone(false)
              setStatus('')
            }}
            className="hidden"
            id="resume-input"
          />
          <label htmlFor="resume-input" className="cursor-pointer">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-sm text-gray-600">
              {file ? (
                <span className="text-blue-600 font-medium">{file.name}</span>
              ) : (
                'Click to select your resume PDF'
              )}
            </p>
            {!file && (
              <p className="text-xs text-gray-400 mt-1">PDF files only</p>
            )}
          </label>
        </div>

        {file && !done && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        )}

        {status && !error && (
          <p className="text-sm text-center text-green-600">{status}</p>
        )}

        {error && (
          <p className="text-sm text-center text-red-500">{error}</p>
        )}

        {done && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/interview'}
          >
            Start Interview →
          </Button>
        )}
      </CardContent>
    </Card>
  )
}