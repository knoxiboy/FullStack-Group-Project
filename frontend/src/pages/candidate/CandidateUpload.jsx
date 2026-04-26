import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CandidateUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "application/pdf" || 
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          selectedFile.name.endsWith(".docx")) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a PDF or DOCX file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/candidate/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate(`/candidate/analysis/${res.data.analysis._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper flex flex-col items-center">
      <div className="glass-card w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-4 text-center">ATS Resume Scanner</h2>
        <p className="text-gray-400 text-center mb-8">
          Upload your resume in PDF or DOCX format. Our AI-powered engine will analyze it against standard ATS criteria.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label 
              htmlFor="resume-upload"
              className="group border-2 border-dashed border-gray-700 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all bg-white/5"
            >
              <div className="p-4 bg-primary/10 rounded-full mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-primary group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-lg font-semibold mb-1">
                {file ? file.name : "Click to upload or drag and drop"}
              </span>
              <span className="text-sm text-gray-500">PDF, DOCX (Max 5MB)</span>
              <input 
                id="resume-upload"
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.docx"
              />
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-4 text-lg font-bold"
            disabled={!file || loading}
          >
            {loading ? "Analyzing Resume..." : "Scan My Resume"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-primary font-bold text-lg">99%</p>
            <p className="text-xs text-gray-500">Accuracy</p>
          </div>
          <div>
            <p className="text-primary font-bold text-lg">Fast</p>
            <p className="text-xs text-gray-500">Analysis</p>
          </div>
          <div>
            <p className="text-primary font-bold text-lg">Detailed</p>
            <p className="text-xs text-gray-500">Feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateUpload;
