const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

// Helper function to calculate match percentage
const calculateMatchScore = (candidateSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;
  if (!candidateSkills || candidateSkills.length === 0) return 0;

  // Convert to lowercase for case-insensitive matching
  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map((s) => s.toLowerCase());

  // Count how many required skills the candidate has
  let matchCount = 0;
  requiredSkillsLower.forEach((reqSkill) => {
    if (candidateSkillsLower.includes(reqSkill)) {
      matchCount++;
    }
  });

  // Calculate percentage
  const percentage = (matchCount / requiredSkillsLower.length) * 100;
  return Math.round(percentage); // Round to nearest integer
};

// @desc    Get candidates matching a specific job
// @route   GET /api/matches/:jobId
// @access  Private (Recruiters only)
exports.getJobMatches = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // 1. Get the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure user owns the job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access matches for this job",
      });
    }

    // 2. Get all candidates uploaded by this recruiter
    // We exclude rawText to make the query faster and response smaller
    const candidates = await Candidate.find({ uploadedBy: req.user.id }).select(
      "-rawText"
    );

    // 3. Calculate match score for each candidate
    const matchedCandidates = candidates.map((candidate) => {
      // Mongoose documents need to be converted to plain objects to add new properties easily
      const candidateObj = candidate.toObject();
      
      const matchScore = calculateMatchScore(
        candidateObj.skills,
        job.requiredSkills
      );
      
      candidateObj.matchScore = matchScore;
      return candidateObj;
    });

    // 4. Sort candidates by match score (highest first)
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matchedCandidates.length,
      jobTitle: job.title,
      requiredSkills: job.requiredSkills,
      data: matchedCandidates,
    });
  } catch (error) {
    console.error("Error generating matches:", error.message);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
