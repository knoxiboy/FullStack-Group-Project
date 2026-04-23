import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid Level");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert comma-separated string to array and trim whitespace
      const requiredSkills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      if (requiredSkills.length === 0) {
        setError("Please enter at least one required skill.");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/api/jobs", {
        title,
        description,
        experienceLevel,
        requiredSkills,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="mb-4">
          <h2>Create Job Posting</h2>
          <p>Define the requirements to find the perfect match.</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", borderRadius: "0.5rem", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select 
              className="form-control"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              required
              placeholder="e.g. React, Node.js, MongoDB, TypeScript"
            />
            <small className="text-muted mt-1" style={{ display: "block" }}>
              These skills will be used to match candidates against this job.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="6"
              placeholder="Describe the responsibilities and requirements..."
            ></textarea>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
