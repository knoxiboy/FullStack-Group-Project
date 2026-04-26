import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          axios.get("/jobs"),
          axios.get("/resumes/candidates")
        ]);

        setJobs(jobsRes.data.data);
        setCandidates(candidatesRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container page-wrapper flex justify-center items-center">
        <h2 className="text-muted">Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, {user?.username}</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", borderRadius: "0.5rem", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          {error}
        </div>
      )}

      <div className="grid grid-2 mt-4">
        {/* Candidate Stats Card */}
        <div className="glass-card flex justify-between items-center">
          <div>
            <h3>Candidates</h3>
            <p className="text-muted" style={{ margin: 0 }}>Total parsed resumes</p>
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>
            {candidates.length}
          </div>
        </div>

        {/* Job Stats Card */}
        <div className="glass-card flex justify-between items-center">
          <div>
            <h3>Jobs</h3>
            <p className="text-muted" style={{ margin: 0 }}>Active job postings</p>
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--secondary-color)" }}>
            {jobs.length}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 mb-4">
        <h3 className="mb-2">Quick Actions</h3>
        <div className="flex gap-4">
          <Link to="/upload" className="btn btn-primary">
            Upload Resumes
          </Link>
          <Link to="/jobs/new" className="btn btn-outline">
            Create Job Posting
          </Link>
        </div>
      </div>
      
      <div className="grid grid-2 mt-4">
        {/* Jobs List */}
        <div className="glass-card">
          <h3 className="mb-2 text-secondary">Recent Jobs</h3>
          {jobs.length === 0 ? (
            <p className="text-muted">No jobs created yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {jobs.slice(0, 5).map(job => (
                <div key={job._id} style={{ padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "0.5rem", border: "1px solid var(--border-color)" }}>
                  <div className="flex justify-between items-center">
                    <h4 style={{ margin: 0 }}>{job.title}</h4>
                    {/* Link to Matching Engine (Step 10) */}
                    <Link to={`/matches/${job._id}`} className="btn btn-primary" style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}>
                      Find Matches
                    </Link>
                  </div>
                  <p className="text-muted mt-1" style={{ fontSize: "0.9rem", margin: 0 }}>{job.experienceLevel} • {job.requiredSkills.length} required skills</p>
                </div>
              ))}
              {jobs.length > 5 && (
                <Link to="/jobs" className="text-primary text-center" style={{ display: "block", fontSize: "0.9rem" }}>View all jobs</Link>
              )}
            </div>
          )}
        </div>

        {/* Candidates List */}
        <div className="glass-card">
          <h3 className="mb-2 text-primary">Recent Candidates</h3>
          {candidates.length === 0 ? (
            <p className="text-muted">No resumes uploaded yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {candidates.slice(0, 5).map(candidate => (
                <div key={candidate._id} style={{ padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "0.5rem", border: "1px solid var(--border-color)" }}>
                  <h4 style={{ margin: 0 }}>{candidate.name || "Unknown Name"}</h4>
                  <p className="text-muted mt-1" style={{ fontSize: "0.9rem", margin: 0 }}>{candidate.email || "No email"}</p>
                  <div className="flex gap-2 mt-1" style={{ flexWrap: "wrap" }}>
                    {candidate.skills && candidate.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} style={{ padding: "0.1rem 0.4rem", background: "rgba(99, 102, 241, 0.1)", borderRadius: "1rem", fontSize: "0.7rem", color: "#818cf8" }}>
                        {skill}
                      </span>
                    ))}
                    {candidate.skills && candidate.skills.length > 3 && (
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", alignSelf: "center" }}>+{candidate.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
