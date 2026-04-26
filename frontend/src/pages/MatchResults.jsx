import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MatchResults = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/matches/${jobId}`);
        setMatches(res.data.data);
        setJobTitle(res.data.jobTitle);
        setRequiredSkills(res.data.requiredSkills);
      } catch (err) {
        console.error("Error fetching matches", err);
        setError("Failed to load match results.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [jobId]);

  // Helper function to color-code match percentage
  const getMatchColor = (score) => {
    if (score >= 80) return "#34d399"; // Green
    if (score >= 50) return "#fbbf24"; // Yellow
    return "#f87171"; // Red
  };

  if (loading) {
    return (
      <div className="container page-wrapper flex justify-center items-center">
        <h2 className="text-muted">Calculating Matches...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-wrapper">
        <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", borderRadius: "0.5rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          {error}
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline mt-4">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-gradient">Match Results</h2>
          <p>Showing best candidate matches for: <strong style={{ color: "white" }}>{jobTitle}</strong></p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline">
          Back to Dashboard
        </button>
      </div>

      <div className="glass-card mb-4">
        <h4>Required Skills</h4>
        <div className="flex gap-2 mt-2" style={{ flexWrap: "wrap" }}>
          {requiredSkills.map((skill, i) => (
            <span key={i} style={{ padding: "0.3rem 0.8rem", background: "var(--primary-color)", color: "white", borderRadius: "1rem", fontSize: "0.9rem" }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="grid">
        {matches.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: "3rem" }}>
             <h3>No candidates found.</h3>
             <p className="text-muted">Upload more resumes to find matches for this job.</p>
             <Link to="/upload" className="btn btn-primary mt-2">Upload Resumes</Link>
          </div>
        ) : (
          matches.map((candidate, index) => (
            <div key={candidate._id} className="glass-card flex justify-between" style={{ position: "relative", overflow: "hidden" }}>
              
              {/* Highlight bar on the left indicating match strength */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6px", backgroundColor: getMatchColor(candidate.matchScore) }}></div>
              
              <div style={{ paddingLeft: "1rem", flex: 1 }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {index + 1}. {candidate.name || "Unknown Candidate"}
                    </h3>
                    <p className="text-muted" style={{ fontSize: "0.9rem", margin: "0.2rem 0 1rem 0" }}>
                      {candidate.email} | {candidate.phone || "No phone"}
                    </p>
                  </div>
                  
                  {/* Match Score Badge */}
                  <div style={{ 
                    background: `rgba(${candidate.matchScore >= 80 ? '16, 185, 129' : candidate.matchScore >= 50 ? '245, 158, 11' : '239, 68, 68'}, 0.1)`, 
                    border: `1px solid ${getMatchColor(candidate.matchScore)}`,
                    color: getMatchColor(candidate.matchScore),
                    padding: "0.5rem 1rem",
                    borderRadius: "2rem",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    {candidate.matchScore}% Match
                  </div>
                </div>

                <div>
                  <h5 className="mb-1">Extracted Skills:</h5>
                  <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                    {candidate.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((skill, i) => {
                        // Check if this skill is in the required skills list (case-insensitive)
                        const isMatch = requiredSkills.some(rs => rs.toLowerCase() === skill.toLowerCase());
                        
                        return (
                          <span key={i} style={{ 
                            padding: "0.2rem 0.6rem", 
                            background: isMatch ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)", 
                            border: `1px solid ${isMatch ? "rgba(16, 185, 129, 0.5)" : "transparent"}`,
                            borderRadius: "1rem", 
                            fontSize: "0.8rem", 
                            color: isMatch ? "#34d399" : "var(--text-muted)" 
                          }}>
                            {skill} {isMatch && "✓"}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-muted">No specific skills extracted</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchResults;
