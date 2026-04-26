import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/candidate/history");
        setHistory(res.data.history);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container page-wrapper">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
          <p className="text-gray-400">Track your resume performance and ATS compatibility.</p>
        </div>
        <Link to="/candidate/upload" className="btn btn-primary">
          Scan New Resume
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card text-center p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Scans</h3>
          <p className="text-4xl font-bold">{history.length}</p>
        </div>
        <div className="glass-card text-center p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Average Score</h3>
          <p className="text-4xl font-bold text-primary">
            {history.length > 0 
              ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / history.length) 
              : 0}
          </p>
        </div>
        <div className="glass-card text-center p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Best Score</h3>
          <p className="text-4xl font-bold text-green-400">
            {history.length > 0 ? Math.max(...history.map(h => h.overallScore)) : 0}
          </p>
        </div>
      </div>

      <div className="glass-card p-8 mb-10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Profile ATS Readiness</h3>
          <span className="text-primary font-bold">75%</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-1000" style={{ width: "75%" }}></div>
        </div>
        <p className="text-sm text-gray-400 mt-4 italic">
          "Your profile is stronger than 80% of candidates in our network. Add more technical projects to reach 90%."
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Recent Scans</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Fetching your scan history...</p>
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <Link 
              to={`/candidate/analysis/${item._id}`} 
              key={item._id} 
              className="glass-card hover:border-primary transition-all p-6 block"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.overallScore >= 80 ? "bg-green-500/20 text-green-400" : 
                  item.overallScore >= 60 ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-red-500/20 text-red-400"
                }`}>
                  Score: {item.overallScore}
                </div>
              </div>
              <h4 className="font-bold truncate mb-1">{item.fileName}</h4>
              <p className="text-xs text-gray-500">
                Analyzed on {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card text-center py-16">
          <p className="text-gray-400 mb-6">You haven't scanned any resumes yet.</p>
          <Link to="/candidate/upload" className="btn btn-primary">
            Upload Your First Resume
          </Link>
        </div>
      )}
      {/* Recommended Jobs */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-primary">●</span> Top Job Matches for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { role: "Senior Frontend Engineer", company: "Google", match: "98%", location: "Remote" },
            { role: "Full Stack Developer", company: "Meta", match: "94%", location: "Menlo Park, CA" },
            { role: "Product Designer", company: "Airbnb", match: "89%", location: "San Francisco, CA" }
          ].map((job, i) => (
            <div key={i} className="glass-card hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{job.role}</h4>
                  <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">
                  {job.match} Match
                </span>
              </div>
              <button className="w-full py-2 bg-white/5 border border-white/5 rounded-lg text-sm font-bold hover:bg-primary hover:text-black transition-all">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
