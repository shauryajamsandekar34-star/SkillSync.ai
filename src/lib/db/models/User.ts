import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },

  resumeData: {
    skills: [String],
    experience: [String],
    projects: [String],
    rawText: String,
  },

  interviews: [{
    date: { type: Date, default: Date.now },
    questions: [String],
    answers: [String],
    scores: {
      communication: Number,
      technical: Number,
      confidence: Number,
    }
  }],

  weaknesses: [String],
  strengths: [String],

  studyPlan: [{
    topic: String,
    resources: [String],
    completed: { type: Boolean, default: false },
  }]

}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)