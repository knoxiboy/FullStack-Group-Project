const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a job title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    requiredSkills: {
      type: [String],
      required: [true, "Please add at least one required skill"],
    },
    experienceLevel: {
      type: String,
      required: [true, "Please specify experience level"],
      enum: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
      default: "Mid Level",
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    acceptedCandidates: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Candidate",
      },
    ],
    rejectedCandidates: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Candidate",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// We might want to add virtuals here later if needed

module.exports = mongoose.model("Job", jobSchema);
