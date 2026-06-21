import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateQuestions(resumeData: any, weaknesses: string[] = []) {
  const weaknessText = weaknesses.length > 0
    ? `Focus extra questions on these weak areas: ${weaknesses.join(', ')}`
    : ''

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are a senior technical interviewer. Generate 5 interview questions based on this candidate's resume.
        ${weaknessText}
        Skills: ${resumeData.skills?.join(', ')}
        Experience: ${resumeData.experience?.join(', ')}
        Projects: ${resumeData.projects?.join(', ')}
        Return ONLY a JSON array with no extra text:
        [
          {"id": 1, "question": "...", "type": "technical"},
          {"id": 2, "question": "...", "type": "behavioral"},
          {"id": 3, "question": "...", "type": "technical"},
          {"id": 4, "question": "...", "type": "behavioral"},
          {"id": 5, "question": "...", "type": "technical"}
        ]`
      }
    ],
  })

  const response = completion.choices[0].message.content || ''
  const clean = response.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}