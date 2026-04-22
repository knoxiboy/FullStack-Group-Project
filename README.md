# Resume Parser & Matching Engine

A full-stack MERN web application that helps recruiters automatically extract and analyze information from resumes, match candidates with job requirements using skill-based scoring, and rank candidates for quick shortlisting.

---

## Table of Contents

- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [User Scenario](#user-scenario)
- [Architecture](#architecture)
- [System Flow](#system-flow)
- [User Flow](#user-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Key Features](#key-features)
- [Skill Matching Algorithm](#skill-matching-algorithm)
- [Implementation Phases](#implementation-phases)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Optional Advanced Features](#optional-advanced-features)
- [Learning Outcomes](#learning-outcomes)
- [Contributors](#contributors)

---

## Introduction

Recruiters often receive hundreds of resumes for a single job opening, making manual screening time-consuming and inefficient. This system allows recruiters to:

- **Upload** candidate resumes (PDF / DOCX)
- **Automatically extract** structured information — skills, education, and work experience
- **Store** candidate data in a searchable MongoDB database
- **Compare** candidate profiles with job descriptions
- **Generate** a ranking score based on skill matching
- **Shortlist** the most suitable candidates quickly

The project demonstrates document parsing, automated candidate screening, skill matching algorithms, and full-stack MERN development.

---

## Problem Statement

| Challenge | How We Solve It |
|---|---|
| Difficulty extracting key information from resumes | Automated parsing with `pdf-parse` and `mammoth` |
| Lack of structured candidate data | Extracted data stored in MongoDB collections |
| Time-consuming manual screening | One-click skill matching engine |
| Difficulty matching skills with job requirements | Algorithmic scoring and candidate ranking |

---

## User Scenario

> **Priya** is a recruiter hiring a **Java Full Stack Developer**.
>
> 1. She uploads multiple candidate resumes to the system
> 2. The system automatically extracts: Skills, Education, Work Experience
> 3. Priya enters the job requirements: Java, Spring Boot, React, SQL
> 4. The system compares candidate skills with job requirements
> 5. Each candidate receives a **matching score** (0–100%)
> 6. Priya views a **ranked list** and shortlists the best matches

---

## Architecture

The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React.js)               │
│  Resume Upload • Candidate Dashboard • Job Form     │
│  Match Results • Auth Pages                         │
└──────────────────────┬──────────────────────────────┘
                       │ Axios HTTP Requests
                       ▼
┌─────────────────────────────────────────────────────┐
│               BACKEND (Node.js + Express.js)        │
│  REST APIs • JWT Auth • Multer File Upload          │
│  Resume Parser Service • Skill Matching Engine      │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                  │
│  Users • Candidates • Jobs • Matches                │
└─────────────────────────────────────────────────────┘
```

---

## System Flow

```
Step 1: Recruiter Registration
  └─ Recruiter creates an account (name, email, password)

Step 2: Authentication
  └─ Login using email/password → JWT token issued

Step 3: Resume Upload
  └─ Upload PDF or DOCX → stored in /uploads via Multer

Step 4: Resume Parsing
  └─ pdf-parse / mammoth extracts raw text
  └─ Parser service extracts: name, email, skills[], education[], experience[]

Step 5: Data Storage
  └─ Structured candidate data saved to MongoDB (Candidate collection)

Step 6: Job Requirement Input
  └─ Recruiter creates a job with title, description, and requiredSkills[]

Step 7: Skill Matching Engine
  └─ Compare candidate.skills[] vs job.requiredSkills[]
  └─ Calculate match percentage → store in Match collection

Step 8: Candidate Ranking
  └─ Display candidates sorted by matchScore (descending)
```

---

## User Flow

```
Registration:   Recruiter → Sign Up → Account Created → Login
Upload:         Recruiter → Upload Resume → System Extracts Data → Candidate Saved
Job Input:      Recruiter → Create Job → Enter Required Skills
Matching:       Recruiter → Run Matching → System Compares Skills → Scores Calculated
Shortlisting:   Recruiter → View Ranked Candidates → Shortlist Top Matches
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18+ | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend |
| Tailwind CSS | Styling |
| React Context API | Auth state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| JWT (jsonwebtoken) | Authentication tokens |
| Bcrypt.js | Password hashing |
| Multer | File upload handling |
| pdf-parse | PDF text extraction |
| mammoth | DOCX text extraction |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | Document database |
| Mongoose | ODM for schema/model management |

### Development Tools
| Tool | Purpose |
|---|---|
| VS Code | IDE |
| Git + GitHub | Version control |
| Postman / Thunder Client | API testing |
| Nodemon | Auto-restart backend on changes |
| Concurrently | Run frontend + backend simultaneously |

---

## Project Structure

```
FullStack Group Project/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, profile
│   │   ├── resumeController.js      # Upload, parse, list candidates
│   │   ├── jobController.js         # CRUD for job descriptions
│   │   └── matchController.js       # Run matching, get rankings
│   │
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification middleware
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (recruiter/admin)
│   │   ├── Candidate.js             # Candidate schema (parsed resume data)
│   │   ├── Job.js                   # Job schema (title, requiredSkills)
│   │   └── Match.js                 # Match schema (candidateId, jobId, score)
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # POST /signup, POST /login
│   │   ├── resumeRoutes.js          # POST /upload, GET /candidates
│   │   ├── jobRoutes.js             # CRUD /jobs
│   │   └── matchRoutes.js           # POST /match, GET /rankings/:jobId
│   │
│   ├── services/
│   │   ├── resumeParser.js          # Core: text → structured data extraction
│   │   └── matchingEngine.js        # Core: skill comparison algorithm
│   │
│   ├── uploads/                     # Multer file storage directory
│   │
│   ├── utils/
│   │   └── helpers.js               # Shared utility functions
│   │
│   ├── .env                         # Environment variables (DO NOT COMMIT)
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── public/
│   │   ├── icons/                   # SVG icons
│   │   └── images/                  # Static images
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx        # Login form component
│   │   │   │   └── SignupForm.jsx       # Signup form component
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   │   ├── Footer.jsx           # Footer
│   │   │   │   ├── FileUploader.jsx     # Drag & drop file uploader
│   │   │   │   ├── ScoreCircle.jsx      # Circular score display
│   │   │   │   ├── ScoreGauge.jsx       # Gauge score visualization
│   │   │   │   ├── ScoreBadge.jsx       # Score pill/badge
│   │   │   │   ├── Accordion.jsx        # Expandable sections
│   │   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   │   └── ProtectedRoute.jsx   # Auth guard wrapper
│   │   │   ├── candidates/
│   │   │   │   ├── CandidateCard.jsx    # Candidate summary card
│   │   │   │   └── CandidateList.jsx    # List of parsed candidates
│   │   │   ├── jobs/
│   │   │   │   ├── JobCard.jsx          # Job summary card
│   │   │   │   └── JobForm.jsx          # Create/edit job form
│   │   │   └── matching/
│   │   │       ├── RankingTable.jsx     # Ranked candidates table
│   │   │       └── MatchSummary.jsx     # Match score summary
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx            # Login page
│   │   │   ├── SignupPage.jsx           # Signup page
│   │   │   ├── DashboardPage.jsx        # Main recruiter dashboard
│   │   │   ├── UploadResumePage.jsx     # Resume upload page
│   │   │   ├── CandidatesPage.jsx       # All candidates list
│   │   │   ├── CandidateDetailPage.jsx  # Single candidate detail view
│   │   │   ├── JobsPage.jsx             # All jobs list
│   │   │   ├── CreateJobPage.jsx        # Create new job
│   │   │   └── MatchResultsPage.jsx     # Ranked results for a job
│   │   │
│   │   ├── services/
│   │   │   └── api.js                   # Axios instance + API functions
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication context provider
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js              # Custom auth hook
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js              # Frontend utility functions
│   │   │
│   │   ├── styles/
│   │   │   └── index.css               # Global styles / Tailwind imports
│   │   │
│   │   ├── App.jsx                     # Root component with routes
│   │   └── main.jsx                    # ReactDOM entry point
│   │
│   └── package.json
│
├── .gitignore
└── README.md                           # ← You are here
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String,          // required, unique
  email: String,             // required, unique
  password: String,          // required, hashed with bcrypt
  role: String,              // "recruiter" | "admin", default: "recruiter"
  createdAt: Date            // auto-generated
}
```

### Candidates Collection

```javascript
{
  _id: ObjectId,
  name: String,              // extracted from resume
  email: String,             // extracted from resume
  phone: String,             // extracted from resume
  skills: [String],          // ["Java", "React", "SQL", ...]
  education: [{
    degree: String,          // "B.Tech Computer Science"
    institution: String,     // "IIT Delhi"
    year: String             // "2020"
  }],
  experience: [{
    title: String,           // "Software Engineer"
    company: String,         // "Google"
    duration: String,        // "2 years"
    description: String      // role summary
  }],
  resumeFile: String,        // file path in /uploads
  rawText: String,           // full extracted text (for re-parsing)
  uploadedBy: ObjectId,      // ref → Users
  createdAt: Date
}
```

### Jobs Collection

```javascript
{
  _id: ObjectId,
  title: String,             // "Java Full Stack Developer"
  description: String,       // full job description text
  requiredSkills: [String],  // ["Java", "Spring Boot", "React", "SQL"]
  createdBy: ObjectId,       // ref → Users
  createdAt: Date
}
```

### Matches Collection

```javascript
{
  _id: ObjectId,
  candidateId: ObjectId,     // ref → Candidates
  jobId: ObjectId,           // ref → Jobs
  matchScore: Number,        // 0–100 percentage
  matchedSkills: [String],   // skills that matched
  missingSkills: [String],   // required skills candidate lacks
  createdAt: Date
}
```

### ER Relationships

```
Users ──(1:N)──▶ Candidates   (a recruiter uploads many candidates)
Users ──(1:N)──▶ Jobs          (a recruiter creates many jobs)
Candidates ──(N:M)──▶ Jobs     (via Matches join collection)
```

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new recruiter | No |
| POST | `/api/auth/login` | Login, returns JWT token | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Resume Routes — `/api/resumes`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/resumes/upload` | Upload & parse a resume file | Yes |
| GET | `/api/resumes/candidates` | List all parsed candidates | Yes |
| GET | `/api/resumes/candidates/:id` | Get single candidate detail | Yes |
| DELETE | `/api/resumes/candidates/:id` | Delete a candidate | Yes |

### Job Routes — `/api/jobs`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/jobs` | Create a new job description | Yes |
| GET | `/api/jobs` | List all jobs | Yes |
| GET | `/api/jobs/:id` | Get single job detail | Yes |
| PUT | `/api/jobs/:id` | Update a job | Yes |
| DELETE | `/api/jobs/:id` | Delete a job | Yes |

### Match Routes — `/api/matches`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/matches/run/:jobId` | Run matching for all candidates against a job | Yes |
| GET | `/api/matches/rankings/:jobId` | Get ranked candidates for a job | Yes |
| GET | `/api/matches/candidate/:candidateId` | Get all match results for a candidate | Yes |

---

## Key Features

### 1. Authentication
- Recruiter signup with email and password
- Secure login with JWT token generation
- Protected routes requiring valid token
- Password hashing with bcrypt (10 salt rounds)

### 2. Resume Upload
- Accept PDF and DOCX file formats
- Server-side file storage via Multer
- Max file size: 5MB
- Drag-and-drop UI with file preview

### 3. Resume Parsing
- **PDF parsing** using `pdf-parse` library
- **DOCX parsing** using `mammoth` library
- Extract structured data from raw text:
  - Candidate name and contact information
  - Skills array (matched against a skills dictionary)
  - Education details (degree, institution, year)
  - Work experience (title, company, duration)

### 4. Skill Matching Engine
- Compare `candidate.skills[]` against `job.requiredSkills[]`
- Calculate match percentage: `(matched / total_required) × 100`
- Track matched and missing skills per candidate
- Store results in Matches collection

### 5. Candidate Ranking
- Sort candidates by `matchScore` (highest first)
- Display in a ranked table with score visualization
- Color-coded scores: green (≥85), blue (≥70), yellow (≥50), red (<50)
- Quick shortlisting capabilities

---

## Skill Matching Algorithm

```
FUNCTION calculateMatchScore(candidateSkills, requiredSkills):
    normalize all skills to lowercase and trim whitespace

    matchedCount = 0
    matchedSkills = []
    missingSkills = []

    FOR EACH skill IN requiredSkills:
        IF skill EXISTS IN candidateSkills:
            matchedCount += 1
            ADD skill TO matchedSkills
        ELSE:
            ADD skill TO missingSkills

    matchScore = ROUND((matchedCount / LENGTH(requiredSkills)) × 100)

    RETURN {
        matchScore,        // 0–100
        matchedSkills,     // skills that matched
        missingSkills,     // skills candidate is missing
        totalRequired: LENGTH(requiredSkills)
    }
```

### Score Interpretation

| Score Range | Label | Color |
|---|---|---|
| 85 – 100 | Excellent Match | 🟢 Green |
| 70 – 84 | Strong Match | 🔵 Blue |
| 50 – 69 | Partial Match | 🟡 Yellow |
| 0 – 49 | Weak Match | 🔴 Red |

---

## Implementation Phases

### Phase 1: Project Setup & Auth
- Initialize backend with Express.js
- MongoDB connection with Mongoose
- User model + JWT auth (signup/login)
- Auth middleware for protected routes
- Initialize React frontend with Vite
- Login and Signup pages with AuthContext

### Phase 2: Resume Upload & Parsing
- Multer file upload endpoint
- `pdf-parse` and `mammoth` text extraction on the backend
- Resume parser service (regex/keyword-based skill, education, experience extraction)
- Candidate model and CRUD APIs
- Upload page UI with drag-and-drop

### Phase 3: Job Management
- Job model and CRUD APIs
- Job creation form page
- Job listing page with cards

### Phase 4: Matching Engine & Ranking
- Skill matching algorithm in `matchingEngine.js`
- Match calculation endpoint (`POST /api/matches/run/:jobId`)
- Match model and storage
- Candidate ranking endpoint sorted by score
- Match results page with ranked table

### Phase 5: Dashboard & Polish
- Recruiter dashboard with overview stats
- Candidate detail view with full parsed data
- Score visualizations (ScoreCircle, ScoreGauge)
- Loading states, error handling, form validation
- Responsive design

### Phase 6: Finalization
- Input sanitization and security
- API error handling middleware
- SEO meta tags
- Final testing with Postman
- Documentation and deployment prep

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/FullStack-Group-Project.git
cd FullStack-Group-Project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-parser
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files.** They are listed in `.gitignore`.

---

## Optional Advanced Features

These can be added after the core system is complete:

- [ ] AI-based resume analysis (using Gemini / OpenAI API)
- [ ] Resume keyword highlighting
- [ ] Candidate profile dashboard with analytics
- [ ] Automatic email notifications for shortlisted candidates
- [ ] Resume similarity detection between candidates
- [ ] Machine learning–based skill matching with synonym support
- [ ] Bulk resume upload (multiple files at once)
- [ ] Export rankings to CSV / PDF
- [ ] Admin panel for user management

---

## Learning Outcomes

By completing this project, the team will learn:

- Full-stack **MERN** application development
- Document parsing and text extraction
- Skill matching algorithms and scoring
- File upload and server-side processing
- REST API design and development
- MongoDB schema design with references
- JWT authentication and route protection
- React component architecture and state management
- Responsive UI design with Tailwind CSS

---

## Contributors

| Name | Role | Responsibilities |
|---|---|---|
| | Backend Lead | Express APIs, MongoDB models, Auth |
| | Frontend Lead | React pages, components, routing |
| | Parser & Matching | Resume parser service, matching engine |
| | UI/UX & Integration | Styling, API integration, testing |

---

## License

This project is for educational purposes as part of a Full Stack Development course.
