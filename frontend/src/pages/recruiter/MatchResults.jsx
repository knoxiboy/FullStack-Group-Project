import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Target, 
  ArrowLeft, 
  Users, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  Mail, 
  Phone,
  ChevronRight,
  Loader2,
  AlertCircle,
  Trophy,
  Filter
} from "lucide-react";
import { cn } from "../../lib/utils";

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
        const res = await axios.get(`/api/matches/${jobId}`);
        setMatches(res.data.data);
        setJobTitle(res.data.jobTitle);
        setRequiredSkills(res.data.requiredSkills);
      } catch (err) {
        console.error("Error fetching matches", err);
        setError("Failed to synchronize with MaesterMatch engine.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 text-indigo-500 animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">MaesterMatch Engine Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
             <button 
                onClick={() => navigate("/dashboard")}
                className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]"
              >
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                Return to Dashboard
              </button>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Target className="size-3" />
                Precision Ranking
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter">
                Match <span className="text-gradient">Intelligence</span>
              </h1>
              <p className="text-gray-400 font-medium">Best candidate fits for: <span className="text-white font-black">{jobTitle}</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
               <Users className="size-4 text-primary-400" />
               <span className="text-white font-black text-sm">{matches.length} Candidates</span>
             </div>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white">
               <Filter className="size-4" />
             </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-in shake-2">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        {/* Required Skills Summary */}
        <div className="glass-card p-6 bg-indigo-500/5 border-indigo-500/10">
           <div className="flex items-center gap-3 mb-4">
              <Search className="size-4 text-indigo-400" />
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Required Target Skills</h3>
           </div>
           <div className="flex flex-wrap gap-2">
             {requiredSkills.map((skill, i) => (
               <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
                 {skill}
               </span>
             ))}
           </div>
        </div>

        {/* Matches Grid */}
        <div className="grid gap-6">
          {matches.length === 0 ? (
            <div className="glass-card p-20 text-center space-y-6">
               <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                 <Search className="size-10 text-gray-700" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-white">No matches found yet.</h3>
                 <p className="text-gray-500 max-w-sm mx-auto">Upload more resumes to populate your talent pool for this position.</p>
               </div>
               <Link to="/upload" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20">
                 <Users className="size-4" />
                 Upload Resumes
               </Link>
            </div>
          ) : (
            matches.map((candidate, index) => {
              const score = candidate.matchScore;
              const isHighMatch = score >= 85;
              const isMidMatch = score >= 65 && score < 85;
              
              return (
                <div key={candidate._id} className="glass-card overflow-hidden group hover:bg-white/2 transition-all relative">
                  {/* Match Indicator Stripe */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-2",
                    isHighMatch ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : 
                    isMidMatch ? "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]" : "bg-rose-500"
                  )} />

                  <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-gradient shrink-0">
                          {candidate.name?.charAt(0) || "U"}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-white">{candidate.name || "Unknown Candidate"}</h3>
                            {index === 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Trophy className="size-3" /> Top Pick
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                             <span className="flex items-center gap-1.5"><Mail className="size-3" /> {candidate.email}</span>
                             {candidate.phone && <span className="flex items-center gap-1.5"><Phone className="size-3" /> {candidate.phone}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                          <CheckCircle2 className="size-3" /> Core Skill Alignment
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills && candidate.skills.map((skill, i) => {
                            const isMatched = requiredSkills.some(rs => rs.toLowerCase() === skill.toLowerCase());
                            return (
                              <span key={i} className={cn(
                                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all",
                                isMatched 
                                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5" 
                                  : "bg-white/5 border border-white/10 text-gray-500"
                              )}>
                                {skill} {isMatched && "✓"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Score Visualization */}
                    <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                       <div className="relative size-32 flex items-center justify-center">
                          {/* Progress Circle SVG */}
                          <svg className="size-full -rotate-90">
                             <circle cx="64" cy="64" r="58" className="fill-none stroke-white/5 stroke-[8]" />
                             <circle 
                                cx="64" cy="64" r="58" 
                                className={cn(
                                  "fill-none stroke-[8] transition-all duration-1000 ease-out",
                                  isHighMatch ? "stroke-emerald-500" : isMidMatch ? "stroke-amber-500" : "stroke-rose-500"
                                )}
                                strokeDasharray={2 * Math.PI * 58}
                                strokeDashoffset={2 * Math.PI * 58 * (1 - score / 100)}
                                strokeLinecap="round"
                             />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{score}%</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fit Score</span>
                          </div>
                       </div>
                       
                       <Link 
                        to={`/report/${candidate._id}`} 
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5 group/btn"
                       >
                         Full Report
                         <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
