// resumeRoutes.js - Route definitions for resume upload and candidate management
// All routes in this file require authentication.

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const {
  upload,
  uploadResume,
  getCandidates,
  getCandidateById,
  deleteCandidate,
} = require("../../controllers/recruiter/resumeController");

// POST /api/resumes/upload - Upload and parse a resume file
// upload.single("resume") tells Multer to expect a single file
// with the field name "resume" in the form data
router.post("/upload", auth, upload.single("resume"), uploadResume);

// GET /api/resumes/candidates - List all candidates
router.get("/candidates", auth, getCandidates);

// GET /api/resumes/candidates/:id - Get one candidate's details
router.get("/candidates/:id", auth, getCandidateById);

// DELETE /api/resumes/candidates/:id - Delete a candidate
router.delete("/candidates/:id", auth, deleteCandidate);

// PUT /api/resumes/candidates/:id - Update a candidate
router.put("/candidates/:id", auth, require("../../controllers/recruiter/resumeController").updateCandidate);

module.exports = router;
