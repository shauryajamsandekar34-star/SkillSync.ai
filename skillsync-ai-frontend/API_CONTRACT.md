# API Contract — SkillSync AI

This is the agreement the frontend is built against. Until the backend
exists, `lib/api.js` returns mock data matching these exact shapes — so the
fastest way to integrate is to make the real endpoints return the same
shapes, then set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`. No frontend
code needs to change.

## 1. Resume upload & analysis

`POST /api/resume/upload`
Content-Type: `multipart/form-data`, field name `resume` (PDF or DOCX file)

Response `200`:
```json
{
  "atsScore": 78,
  "strengths": ["string", "..."],
  "weaknesses": ["string", "..."],
  "suggestions": ["string", "..."]
}
```

## 2. Get the next interview question

`GET /api/interview/question?role=Frontend+Engineer&difficulty=Medium&exclude=q1,q2`

- `role` — free text, the target job title
- `difficulty` — one of `Easy`, `Medium`, `Hard`
- `exclude` — comma-separated question IDs already asked this session

Response `200` (or `null` body when the bank is exhausted):
```json
{
  "id": "q1",
  "role": "Frontend Engineer",
  "difficulty": "Medium",
  "text": "Tell me about a time you had to optimize a slow-loading page."
}
```

## 3. Submit an answer for scoring

`POST /api/interview/answer`
```json
{ "questionId": "q1", "answerText": "string" }
```

Response `200`:
```json
{
  "score": 72,
  "strengths": ["string", "..."],
  "improvements": ["string", "..."],
  "idealAnswerNotes": "string"
}
```

## 4. Dashboard / progress stats

`GET /api/dashboard/progress`

Response `200`:
```json
{
  "sessionsCompleted": 12,
  "averageScore": 74,
  "scoreHistory": [{ "session": 1, "score": 52 }, { "...": "..." }],
  "strengthAreas": ["string", "..."],
  "weakAreas": ["string", "..."]
}
```

## Notes for whoever builds the backend

- All four endpoints are read independently by the frontend — none of them
  need to exist before the others for the rest of the app to keep working;
  the frontend falls back to mocks per-feature based on the env var.
- Auth, persistence, and session/user identity aren't modeled in this
  contract yet — add headers/params as needed and update `lib/api.js`
  to match once that's decided.
- If response shapes need to change, update both this file and
  `lib/mockData.js` together so the mock and real paths stay in sync.
