const ResumeAnalysis = require("../../models/candidate/ResumeAnalysis");
const { extractText } = require("../../services/candidate/parserService");
const { analyzeResume } = require("../../services/candidate/analysisService");
const fs = require("fs");

/**
 * Handle resume upload and analysis
 * POST /api/candidate/upload
 */
const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;


    const text = await extractText(filePath, mimeType);


    const analysis = await analyzeResume(text);


    const newAnalysis = new ResumeAnalysis({
      user: req.user.id,
      fileName: req.file.originalname,
      ...analysis
    });

    await newAnalysis.save();

    // 4. Cleanup file (optional - keeping it for now in uploads/)
    
    res.status(201).json({
      message: "Resume analyzed successfully",
      analysis: newAnalysis
    });
  } catch (error) {
    console.error("Upload/Analysis error:", error);
    res.status(500).json({ message: error.message || "Failed to analyze resume" });
  }
};

/**
 * Get analysis history for the current user
 * GET /api/candidate/history
 */
const getHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-rawText"); // Exclude raw text for listing

    res.json({ history });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

/**
 * Get specific analysis detail
 * GET /api/candidate/analysis/:id
 */
const getAnalysisDetail = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json({ analysis });
  } catch (error) {
    console.error("Detail fetch error:", error);
    res.status(500).json({ message: "Failed to fetch analysis detail" });
  }
};

module.exports = {
  uploadAndAnalyze,
  getHistory,
  getAnalysisDetail
};
