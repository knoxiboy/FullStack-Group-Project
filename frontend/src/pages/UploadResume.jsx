import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = null; // We'll store the actual file object
  const [fileInputState, setFileInputState] = useState(""); // Used to clear the input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [parsedData, setParsedData] = useState(null);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB check
        setError("File size cannot exceed 5MB");
        setFile(null);
        return;
      }
      
      const fileType = selectedFile.type;
      if (
        fileType !== "application/pdf" &&
        fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setError("Please upload only PDF or DOCX files");
        setFile(null);
        return;
      }
      
      setError("");
      setFile(selectedFile);
      setFileInputState(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setParsedData(null);

    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/api/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Resume parsed successfully!");
      setParsedData(res.data.data);
      // Reset input
      setFile(null);
      setFileInputState("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload and parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="mb-4">
          <h2>Upload Resume</h2>
          <p>Upload a candidate's resume (PDF or DOCX) to extract their details automatically.</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", borderRadius: "0.5rem", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: "0.75rem", background: "rgba(16, 185, 129, 0.1)", color: "#34d399", borderRadius: "0.5rem", marginBottom: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="form-group" style={{ 
            border: "2px dashed var(--border-color)", 
            padding: "3rem", 
            textAlign: "center", 
            borderRadius: "1rem",
            backgroundColor: "rgba(0,0,0,0.2)"
          }}>
            <input
              type="file"
              id="resume"
              onChange={handleFileChange}
              value={fileInputState}
              accept=".pdf,.docx"
              style={{ display: "none" }}
            />
            <label htmlFor="resume" style={{ cursor: "pointer", display: "block" }}>
               <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
               <h3 className="mb-2">Click to select a file</h3>
               <p className="text-muted">Supported formats: PDF, DOCX (Max 5MB)</p>
               {file && <div className="mt-2 text-primary font-weight-bold">Selected: {file.name}</div>}
            </label>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-outline">
              Back to Dashboard
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !file}>
              {loading ? "Parsing Resume..." : "Upload & Parse"}
            </button>
          </div>
        </form>

        {/* Display parsed data results if successful */}
        {parsedData && (
          <div className="mt-4" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
            <h3 className="mb-2 text-gradient">Extraction Results</h3>
            
            <div className="grid grid-2">
              <div>
                <p><strong>Name:</strong> {parsedData.name || "Not found"}</p>
                <p><strong>Email:</strong> {parsedData.email || "Not found"}</p>
                <p><strong>Phone:</strong> {parsedData.phone || "Not found"}</p>
              </div>
              <div>
                 <p><strong>Extracted Skills:</strong></p>
                 <div className="flex gap-2 mt-1" style={{ flexWrap: "wrap" }}>
                  {parsedData.skills && parsedData.skills.length > 0 ? (
                    parsedData.skills.map((skill, i) => (
                      <span key={i} style={{ padding: "0.2rem 0.6rem", background: "rgba(99, 102, 241, 0.2)", borderRadius: "1rem", fontSize: "0.8rem", color: "#818cf8" }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No skills matched</span>
                  )}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
