const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");

/**
 * Extracts text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
const parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF file");
  }
};

/**
 * Extracts text from a DOCX file
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text
 */
const parseDOCX = async (filePath) => {
  try {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  } catch (error) {
    console.error("DOCX Parsing Error:", error);
    throw new Error("Failed to parse DOCX file");
  }
};

/**
 * Main function to extract text based on file type
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (filePath, mimeType) => {
  if (mimeType === "application/pdf") {
    return await parsePDF(filePath);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filePath.endsWith(".docx")
  ) {
    return await parseDOCX(filePath);
  } else {
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  }
};

module.exports = { extractText };
