import ResumeUpload from '@/components/ResumeUpload'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Interview Coach
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Upload your resume and get a personalized interview with real-time feedback
          </p>
        </div>
        <ResumeUpload />
      </div>
    </main>
  )
}