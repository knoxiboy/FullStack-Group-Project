const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
  type: { type: String, enum: ["good", "improve"], required: true },
  tip: { type: String, required: true },
  explanation: { type: String, default: "" }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  tips: [tipSchema]
}, { _id: false });

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fileName: { type: String, required: true },
  overallScore: { type: Number, default: 0 },
  ATS: sectionSchema,
  toneAndStyle: sectionSchema,
  content: sectionSchema,
  structure: sectionSchema,
  skills: sectionSchema,
  rawText: { type: String, default: "" }
}, { timestamps: true });

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

module.exports = ResumeAnalysis;
