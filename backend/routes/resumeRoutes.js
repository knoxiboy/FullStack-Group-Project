// resumeRoutes.js - Route definitions for resume upload and candidate management
// All routes in this file require authentication.

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  upload,
  uploadResume,
  getCandidates,
  getCandidateById,
  deleteCandidate,
} = require("../controllers/resumeController");

// POST /api/resumes/upload - Upload and parse a resume file
// upload.single("resume") tells Multer to expect a single file
// with the field name "resume" in the form data
router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

// GET /api/resumes/candidates - List all candidates
router.get("/candidates", authMiddleware, getCandidates);

// GET /api/resumes/candidates/:id - Get one candidate's details
router.get("/candidates/:id", authMiddleware, getCandidateById);

// DELETE /api/resumes/candidates/:id - Delete a candidate
router.delete("/candidates/:id", authMiddleware, deleteCandidate);

module.exports = router;
