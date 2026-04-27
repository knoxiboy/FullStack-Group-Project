// resumeController.js - Handles resume upload, parsing, and candidate management
// This controller uses Multer for file upload and our resumeParser service
// to extract structured data from uploaded resume files.

const path = require("path");
const multer = require("multer");
const Candidate = require("../../models/recruiter/Candidate");
const { parseResume } = require("../../services/recruiter/resumeParser");

// --- MULTER CONFIGURATION ---
// Multer is a middleware for handling file uploads in Express.
// We configure where to store files and what file names to use.

const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },

  // Generate a unique file name to avoid collisions
  // Format: timestamp-originalname (e.g., 1713900000000-resume.pdf)
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter - only accept PDF and DOCX files
const fileFilter = function (req, file, cb) {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

// Create the multer upload instance with our configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

// --- CONTROLLER FUNCTIONS ---

// Upload and parse a single resume
// Route: POST /api/resumes/upload
const uploadResume = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume file" });
    }

    // Parse the uploaded file to extract candidate data
    const parsedData = await parseResume(req.file.path);

    // Create a new candidate document with the parsed data
    const candidate = new Candidate({
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      skills: parsedData.skills,
      education: parsedData.education,
      experience: parsedData.experience,
      resumeFile: req.file.filename,
      rawText: parsedData.rawText,
      uploadedBy: req.user.id, // From the auth middleware
    });

    // Save the candidate to the database
    await candidate.save();

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      candidate: candidate,
    });
  } catch (error) {
    console.error("Resume upload error:", error.message);
    res.status(500).json({ message: "Error processing resume: " + error.message });
  }
};

// Get all candidates uploaded by the logged-in recruiter
// Route: GET /api/resumes/candidates
const getCandidates = async (req, res) => {
  try {
    // Find all candidates uploaded by this recruiter
    // Sort by newest first, exclude rawText to keep response small
    const candidates = await Candidate
      .find({ uploadedBy: req.user.id })
      .select("-rawText")
      .sort({ createdAt: -1 });

    res.json({ candidates: candidates });
  } catch (error) {
    console.error("Get candidates error:", error.message);
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

// Get a single candidate by ID
// Route: GET /api/resumes/candidates/:id
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({ candidate: candidate });
  } catch (error) {
    console.error("Get candidate error:", error.message);
    res.status(500).json({ message: "Error fetching candidate details" });
  }
};

// Delete a candidate
// Route: DELETE /api/resumes/candidates/:id
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Delete candidate error:", error.message);
    res.status(500).json({ message: "Error deleting candidate" });
  }
};

// Update a candidate
// Route: PUT /api/resumes/candidates/:id
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({
      message: "Candidate updated successfully",
      candidate: candidate,
    });
  } catch (error) {
    console.error("Update candidate error:", error.message);
    res.status(500).json({ message: "Error updating candidate" });
  }
};

// Export the upload middleware along with the controller functions
module.exports = { upload, uploadResume, getCandidates, getCandidateById, deleteCandidate, updateCandidate };
