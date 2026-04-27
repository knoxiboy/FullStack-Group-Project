import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Users, 
  Briefcase, 
  PlusCircle, 
  Upload, 
  Search, 
  TrendingUp, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Mail,
  Trash2,
  Pencil,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllCandidates, setShowAllCandidates] = useState(false);
  
  // Edit States
  const [editingJob, setEditingJob] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          axios.get("/api/jobs"),
          axios.get("/api/resumes/candidates")
        ]);

        setJobs(jobsRes.data.data || []);
        setCandidates(candidatesRes.data.candidates || []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        console.error("Error deleting job", err);
        setError("Failed to delete job posting.");
      }
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(`/api/resumes/candidates/${id}`);
        setCandidates(candidates.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Error deleting candidate", err);
        setError("Failed to delete candidate.");
      }
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title,
      experienceLevel: job.experienceLevel,
      requiredSkills: job.requiredSkills.join(", "),
      description: job.description
    });
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setEditForm({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || "",
      skills: candidate.skills.join(", ")
    });
  };

  const saveJobEdit = async () => {
    try {
      const updatedJob = {
        ...editForm,
        requiredSkills: editForm.requiredSkills.split(",").map(s => s.trim()).filter(s => s)
      };
      await axios.put(`/api/jobs/${editingJob._id}`, updatedJob);
      setJobs(jobs.map(j => j._id === editingJob._id ? { ...j, ...updatedJob } : j));
      setEditingJob(null);
    } catch (err) {
      console.error("Error updating job", err);
      alert("Failed to update job");
    }
  };

  const saveCandidateEdit = async () => {
    try {
      const updatedCandidate = {
        ...editForm,
        skills: editForm.skills.split(",").map(s => s.trim()).filter(s => s)
      };
      await axios.put(`/api/resumes/candidates/${editingCandidate._id}`, updatedCandidate);
      setCandidates(candidates.map(c => c._id === editingCandidate._id ? { ...c, ...updatedCandidate } : c));
      setEditingCandidate(null);
    } catch (err) {
      console.error("Error updating candidate", err);
      alert("Failed to update candidate");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 text-primary-500 animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              Recruiter Command Center
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              Welcome back, <span className="text-gradient">{user?.username}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/jobs/new" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-black text-sm hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5">
              <PlusCircle className="size-4" />
              Create Job
            </Link>
            <Link to="/upload" className="flex items-center gap-2 px-6 py-3 bg-primary-600 border border-primary-500 rounded-2xl text-white font-black text-sm hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20">
              <Upload className="size-4" />
              Resume Upload
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-in shake-2">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8 flex items-center justify-between group hover:border-primary-500/30 transition-all cursor-default">
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Talent Pool</p>
              <h3 className="text-4xl font-black text-white">{candidates.length}</h3>
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                <TrendingUp className="size-3" />
                +12% this month
              </div>
            </div>
            <div className="size-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-500">
              <Users className="size-6 text-primary-400 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="glass-card p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-default">
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active Postings</p>
              <h3 className="text-4xl font-black text-white">{jobs.length}</h3>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">Ready for matching</p>
            </div>
            <div className="size-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-500">
              <Briefcase className="size-6 text-indigo-400 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="glass-card p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-default">
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Average Match</p>
              <h3 className="text-4xl font-black text-white">84%</h3>
              <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-tighter">High accuracy mode</p>
            </div>
            <div className="size-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-500">
              <Search className="size-6 text-emerald-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Jobs - 2/3 width on large */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <Briefcase className="size-6 text-indigo-400" />
                Active Job Postings
              </h2>
              {jobs.length > 5 && (
                <button 
                  onClick={() => setShowAllJobs(!showAllJobs)}
                  className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  {showAllJobs ? "Show Less" : "Show All"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4 opacity-50">
                   <Briefcase className="size-12 text-gray-700 mx-auto" />
                   <p className="text-gray-500 font-bold">No active job postings found.</p>
                </div>
              ) : (
                (showAllJobs ? jobs : jobs.slice(0, 5)).map(job => (
                  <div key={job._id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-white/2 transition-all">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg">
                          <TrendingUp className="size-3 text-emerald-500" />
                          {job.experienceLevel}
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg">
                          <Users className="size-3 text-primary-400" />
                          {job.requiredSkills.length} Skills Required
                        </span>
                      </div>
                    </div>
                                        <div className="flex items-center gap-3">
                      <Link 
                        to={`/matches/${job._id}`} 
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/5 group/btn"
                      >
                        Analyze Matches
                        <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      <button 
                        onClick={() => handleEditJob(job)}
                        className="p-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
                        title="Edit Job"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5"
                        title="Delete Job"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Candidates - 1/3 width */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <Users className="size-6 text-primary-400" />
                Latest Talent
              </h2>
              {candidates.length > 5 && (
                <button 
                  onClick={() => setShowAllCandidates(!showAllCandidates)}
                  className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  {showAllCandidates ? "Show Less" : "Show All"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {candidates.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4 opacity-50">
                   <Users className="size-12 text-gray-700 mx-auto" />
                   <p className="text-gray-500 font-bold">Talent pool is empty.</p>
                </div>
              ) : (
                (showAllCandidates ? candidates : candidates.slice(0, 5)).map(candidate => (
                  <div key={candidate._id} className="glass-card p-5 space-y-4 hover:border-primary-500/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary-500 text-lg">
                        {candidate.name?.charAt(0) || "U"}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-black text-sm group-hover:text-primary-400 transition-colors truncate max-w-[120px]">
                            {candidate.name || "Unknown"}
                          </h4>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleEditCandidate(candidate)}
                              className="p-1.5 text-gray-600 hover:text-primary-400 transition-colors"
                              title="Edit Talent"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCandidate(candidate._id)}
                              className="p-1.5 text-gray-600 hover:text-rose-500 transition-colors"
                              title="Delete Talent"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-[10px] font-medium flex items-center gap-1.5">
                          <Mail className="size-3" />
                          {candidate.email ? (candidate.email.length > 20 ? candidate.email.substring(0, 18) + '...' : candidate.email) : "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills && candidate.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-primary-500/5 border border-primary-500/10 text-[9px] font-bold text-primary-400">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills && candidate.skills.length > 3 && (
                        <span className="text-[9px] font-black text-gray-600 self-center pl-1">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xl" onClick={() => setEditingJob(null)} />
          <div className="glass-card w-full max-w-2xl relative animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Edit Job Posting</h3>
                <button onClick={() => setEditingJob(null)} className="p-2 text-gray-500 hover:text-white transition-colors">
                  <X className="size-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Job Title</label>
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Experience</label>
                    <select 
                      value={editForm.experienceLevel} 
                      onChange={(e) => setEditForm({...editForm, experienceLevel: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all appearance-none"
                    >
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={editForm.requiredSkills} 
                    onChange={(e) => setEditForm({...editForm, requiredSkills: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                  <textarea 
                    value={editForm.description} 
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all min-h-[120px] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={saveJobEdit} className="flex-1 py-4 bg-white text-black font-black rounded-xl hover:bg-primary-500 hover:text-white transition-all">Save Changes</button>
                <button onClick={() => setEditingJob(null)} className="px-8 py-4 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xl" onClick={() => setEditingCandidate(null)} />
          <div className="glass-card w-full max-w-lg relative animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Edit Candidate</h3>
                <button onClick={() => setEditingCandidate(null)} className="p-2 text-gray-500 hover:text-white transition-colors">
                  <X className="size-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Name</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={editForm.skills} 
                    onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={saveCandidateEdit} className="flex-1 py-4 bg-white text-black font-black rounded-xl hover:bg-primary-500 hover:text-white transition-all">Save Changes</button>
                <button onClick={() => setEditingCandidate(null)} className="px-8 py-4 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
