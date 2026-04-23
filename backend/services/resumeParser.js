// resumeParser.js - Core service for extracting data from resumes
// This file takes raw text extracted from a PDF or DOCX file and
// uses regular expressions and keyword matching to pull out
// structured information like name, email, skills, education, etc.

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

// A list of common technical skills to look for in resumes.
// We match candidate resume text against this list.
// You can add more skills to this list as needed.
const SKILLS_DATABASE = [
  // Programming languages
  "javascript", "python", "java", "c++", "c#", "c", "ruby", "php",
  "typescript", "swift", "kotlin", "go", "rust", "scala", "perl",
  "r", "matlab", "dart", "lua",
  // Web technologies
  "html", "css", "react", "angular", "vue", "node.js", "express",
  "next.js", "tailwind", "bootstrap", "jquery", "sass", "webpack",
  // Backend frameworks
  "spring boot", "django", "flask", "rails", "laravel", "fastapi",
  ".net", "asp.net",
  // Databases
  "mongodb", "mysql", "postgresql", "sql", "sqlite", "redis",
  "oracle", "firebase", "dynamodb", "cassandra",
  // Cloud and DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "jenkins",
  "git", "github", "gitlab", "ci/cd", "terraform", "linux",
  // Data and AI
  "machine learning", "deep learning", "tensorflow", "pytorch",
  "pandas", "numpy", "data science", "nlp", "computer vision",
  // Mobile
  "react native", "flutter", "android", "ios", "swift",
  // Other
  "rest api", "graphql", "microservices", "agile", "scrum",
  "jira", "figma", "photoshop", "power bi", "tableau",
];

// --- TEXT EXTRACTION FUNCTIONS ---

// Extract text from a PDF file using the pdf-parse library
async function extractTextFromPDF(filePath) {
  // Read the file into a buffer (binary data)
  const fileBuffer = fs.readFileSync(filePath);
  // pdf-parse reads the buffer and returns an object with a text property
  const data = await pdfParse(fileBuffer);
  return data.text;
}

// Extract text from a DOCX file using the mammoth library
async function extractTextFromDOCX(filePath) {
  // mammoth.extractRawText reads the docx file and returns plain text
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Decide which extraction function to use based on file extension
async function extractText(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    return await extractTextFromPDF(filePath);
  } else if (extension === ".docx") {
    return await extractTextFromDOCX(filePath);
  } else {
    throw new Error("Unsupported file format. Please upload PDF or DOCX.");
  }
}

// --- DATA EXTRACTION FUNCTIONS ---

// Try to find the candidate's name from the resume text
// Usually the name is on the first line or first few lines
function extractName(text) {
  // Split into lines and check the first few non-empty lines
  const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

  // The first line of a resume is usually the candidate's name
  // We check if it looks like a name (2-4 words, no special characters)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // A name typically has 2 to 4 words with only letters and spaces
    const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+){1,3}$/;
    if (namePattern.test(line) && line.length < 50) {
      return line;
    }
  }

  return "Unknown";
}

// Extract email address using a regular expression
function extractEmail(text) {
  // This regex matches standard email formats like name@domain.com
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailPattern);
  return match ? match[0] : "";
}

// Extract phone number using a regular expression
function extractPhone(text) {
  // Match common phone formats: +91-9876543210, (123) 456-7890, 9876543210
  const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phonePattern);
  return match ? match[0] : "";
}

// Find skills by comparing resume text against our skills database
function extractSkills(text) {
  const lowerText = text.toLowerCase();
  const foundSkills = [];

  for (let i = 0; i < SKILLS_DATABASE.length; i++) {
    const skill = SKILLS_DATABASE[i];
    // Check if the skill appears in the text
    // We use word boundary matching for short skills to avoid false positives
    // For example, "c" alone might match many words, so we look for it
    // as a standalone word
    if (skill.length <= 2) {
      // For very short skills like "c" or "r", use word boundary regex
      const regex = new RegExp("\\b" + skill + "\\b", "i");
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    } else {
      // For longer skill names, a simple includes check works fine
      if (lowerText.includes(skill)) {
        foundSkills.push(skill);
      }
    }
  }

  return foundSkills;
}

// Extract education details from the resume text
// Looks for patterns like "B.Tech in Computer Science from IIT Delhi, 2020"
function extractEducation(text) {
  const education = [];

  // Common degree keywords to search for
  const degreePatterns = [
    "b.tech", "b.e.", "b.sc", "b.com", "b.a.", "bca", "bba",
    "m.tech", "m.e.", "m.sc", "m.com", "m.a.", "mca", "mba",
    "ph.d", "phd", "diploma", "bachelor", "master", "degree",
    "b.s.", "m.s.", "bs", "ms",
  ];

  // Split text into lines and look for lines containing degree keywords
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    for (let j = 0; j < degreePatterns.length; j++) {
      if (lowerLine.includes(degreePatterns[j])) {
        // Try to extract a year from the same line or the next line
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? yearMatch[0] : "";

        education.push({
          degree: line.substring(0, 80), // Limit length
          institution: "", // Hard to extract reliably, left for manual entry
          year: year,
        });
        break; // Only match once per line
      }
    }
  }

  return education;
}

// Extract work experience from the resume text
// Looks for section headers like "Experience" or "Work History"
function extractExperience(text) {
  const experience = [];
  const lines = text.split("\n");

  // Find the experience section by looking for common headers
  const experienceHeaders = [
    "experience", "work experience", "employment", "work history",
    "professional experience", "career history",
  ];

  let inExperienceSection = false;
  let currentEntry = null;

  // Section endings that signal we have left the experience section
  const sectionEndings = [
    "education", "skills", "projects", "certifications",
    "achievements", "hobbies", "references", "publications",
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    // Check if we hit a new section that ends the experience section
    if (inExperienceSection) {
      let endSection = false;
      for (let k = 0; k < sectionEndings.length; k++) {
        if (lowerLine.includes(sectionEndings[k]) && line.length < 30) {
          endSection = true;
          break;
        }
      }
      if (endSection) {
        if (currentEntry) {
          experience.push(currentEntry);
        }
        break;
      }
    }

    // Check if this line is an experience section header
    for (let j = 0; j < experienceHeaders.length; j++) {
      if (lowerLine.includes(experienceHeaders[j]) && line.length < 40) {
        inExperienceSection = true;
        break;
      }
    }

    // If we are in the experience section, try to parse entries
    if (inExperienceSection && line.length > 0) {
      // Look for lines that might be job titles or company names
      // A line with a year range like "2020 - 2022" or "2020 - Present"
      const durationMatch = line.match(/(19|20)\d{2}\s*[-to]+\s*(present|(19|20)\d{2})/i);

      if (durationMatch) {
        // If we already have an entry, save it before starting a new one
        if (currentEntry && currentEntry.title) {
          experience.push(currentEntry);
        }
        currentEntry = {
          title: "",
          company: "",
          duration: durationMatch[0],
          description: "",
        };
      } else if (currentEntry && !currentEntry.title && line.length > 3) {
        // The line after a duration is usually the job title
        currentEntry.title = line.substring(0, 80);
      } else if (currentEntry && currentEntry.title && !currentEntry.company && line.length > 3) {
        // The next line might be the company name
        currentEntry.company = line.substring(0, 80);
      }
    }
  }

  // Save the last entry if there is one
  if (currentEntry && currentEntry.title) {
    experience.push(currentEntry);
  }

  return experience;
}

// --- MAIN PARSE FUNCTION ---
// This is the function called by the resume controller.
// It takes a file path, extracts text, and returns structured data.

async function parseResume(filePath) {
  // Step 1: Extract raw text from the file
  const rawText = await extractText(filePath);

  // Step 2: Extract structured fields from the raw text
  const name = extractName(rawText);
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const skills = extractSkills(rawText);
  const education = extractEducation(rawText);
  const experience = extractExperience(rawText);

  // Return everything in a structured object
  return {
    name: name,
    email: email,
    phone: phone,
    skills: skills,
    education: education,
    experience: experience,
    rawText: rawText,
  };
}

module.exports = { parseResume };
