import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function extractResumeData(rawText: string) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `Extract information from this resume and return ONLY a JSON object with no extra text:
        {
          "skills": ["skill1", "skill2"],
          "experience": ["job1", "job2"],
          "projects": ["project1", "project2"],
          "education": "degree and college name"
        }
        
        Resume text:
        ${rawText}`
      }
    ],
  })

  const response = completion.choices[0].message.content || ''
  const clean = response.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}