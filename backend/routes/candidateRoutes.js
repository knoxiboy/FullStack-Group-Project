const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadAndAnalyze, getHistory, getAnalysisDetail } = require("../controllers/candidateController");
const auth = require("../middleware/auth");

// Configure Multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|docx|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed!"));
    }
  },
});

// All candidate routes require authentication
router.use(auth);

// Check if user is a candidate (optional, but good practice)
const isCandidate = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ message: "Access denied. Candidates only." });
  }
  next();
};

router.post("/upload", isCandidate, upload.single("resume"), uploadAndAnalyze);
router.get("/history", isCandidate, getHistory);
router.get("/analysis/:id", isCandidate, getAnalysisDetail);

module.exports = router;
