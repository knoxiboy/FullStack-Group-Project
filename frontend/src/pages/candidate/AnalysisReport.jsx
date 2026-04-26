import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AnalysisReport = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Analysis Report | ResumeAI";
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get(`/candidate/analysis/${id}`);
        setAnalysis(res.data.analysis);
      } catch (err) {
        setError("Failed to fetch analysis report");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) return <div className="container page-wrapper text-center">Loading Report...</div>;
  if (error) return <div className="container page-wrapper text-center text-red-400">{error}</div>;
  if (!analysis) return null;

  const sections = [
    { key: "ATS", title: "ATS Optimization", icon: "🚀" },
    { key: "content", title: "Content Quality", icon: "📄" },
    { key: "skills", title: "Skills & Keywords", icon: "💡" },
    { key: "structure", title: "Structure & Layout", icon: "🏗️" },
    { key: "toneAndStyle", title: "Tone & Style", icon: "✨" },
  ];

  return (
    <div className="container page-wrapper">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-6">
          <Link to="/candidate-dashboard" className="text-gray-400 hover:text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <button 
            onClick={() => window.print()}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Report for</p>
          <h2 className="text-xl font-bold">{analysis.fileName}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Score Card */}
        <div className="lg:col-span-1 glass-card flex flex-col items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <p className="text-gray-400 font-bold uppercase tracking-tighter mb-4 text-sm">Overall Score</p>
          <div className="relative">
            <svg className="w-48 h-48 transform transition-transform hover:scale-105 duration-500">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - analysis.overallScore / 100)}
                className="text-primary transition-all duration-1000 ease-out"
                transform="rotate(-90 96 96)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black">{analysis.overallScore}</span>
              <span className="text-gray-500 font-bold">/ 100</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className={`text-xl font-bold ${
              analysis.overallScore >= 80 ? "text-green-400" : 
              analysis.overallScore >= 60 ? "text-yellow-400" : "text-red-400"
            }`}>
              {analysis.overallScore >= 80 ? "Excellent Match!" : 
               analysis.overallScore >= 60 ? "Strong Foundation" : "Needs Improvement"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Your resume is {analysis.overallScore}% ready for major ATS platforms.
            </p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card">
            <h3 className="text-xl font-bold mb-6">Section Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map(section => (
                <div key={section.key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span>{section.icon}</span>
                      <span className="font-semibold text-sm">{section.title}</span>
                    </div>
                    <span className="font-bold text-primary">{analysis[section.key].score}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${analysis[section.key].score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-xl font-bold mb-6">Top Recommendations</h3>
            <div className="flex flex-col gap-4">
              {sections.flatMap(s => analysis[s.key].tips)
                .filter(tip => tip.type === "improve")
                .slice(0, 4)
                .map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                  <div className="p-2 bg-yellow-500/20 rounded-lg h-fit text-yellow-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-100">{tip.tip}</h4>
                    <p className="text-sm text-gray-400 mt-1">{tip.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Tips Section */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <span className="p-2 bg-blue-500/10 rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          Pro Tips for High ATS Scoring
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Keywords", desc: "Align with JD keywords." },
            { title: "No Tables", desc: "Parsers hate nested tables." },
            { title: "Standard Font", desc: "Use Arial, Calibri, or Roboto." },
            { title: "PDF Format", desc: "Best for layout preservation." }
          ].map((tip, idx) => (
            <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <p className="font-bold text-blue-400 mb-1">{tip.title}</p>
              <p className="text-sm text-gray-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* High Impact Skills Section */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <span className="p-2 bg-emerald-500/10 rounded-lg">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          Top Skills Recruiters Look For
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Agile", "Cloud Computing", "Stakeholder Management", "Data Analytics", "CI/CD", "Public Speaking", "Problem Solving", "System Architecture"].map((s, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
              {s}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4 italic">Tip: Include these if they apply to your experience to increase matching score.</p>
      </div>

      {/* Full Detailed Breakdown */}
      <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
      <div className="flex flex-col gap-6 mb-12">
        {sections.map(section => (
          <div key={section.key} className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{section.icon}</span>
              <h3 className="text-xl font-bold">{section.title}</h3>
              <span className="ml-auto px-4 py-1 bg-primary/10 text-primary rounded-full font-bold">
                {analysis[section.key].score}/100
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis[section.key].tips.map((tip, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${
                  tip.type === "good" 
                    ? "bg-green-500/5 border-green-500/10" 
                    : "bg-yellow-500/5 border-yellow-500/10"
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-1.5 rounded-full ${
                      tip.type === "good" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {tip.type === "good" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-bold">{tip.tip}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{tip.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Extracted Text Section */}
      <div className="glass-card mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">●</span> Extracted Content Preview
          </h3>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(analysis.extractedText);
              alert("Text copied to clipboard!");
            }}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Text
          </button>
        </div>
        <div className="bg-black/40 rounded-xl p-6 border border-white/5 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
            {analysis.extractedText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
