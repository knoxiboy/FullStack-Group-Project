import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Briefcase, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  Code2, 
  Layers, 
  AlignLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "../../lib/utils";

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
      const requiredSkills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      if (requiredSkills.length === 0) {
        setError("Please enter at least one required skill.");
        setLoading(false);
        return;
      }

      await axios.post("/api/jobs", {
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
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="glass-card overflow-hidden relative">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 size-48 bg-primary-500/20 blur-[80px] rounded-full" />
          
          <div className="p-8 md:p-12 space-y-10 relative">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="size-3" />
                New Opportunity
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                Create <span className="text-gradient">Job Posting</span>
              </h1>
              <p className="text-gray-400 font-medium">Define your requirements to find the perfect match.</p>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Briefcase className="size-3 text-primary-400" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-gray-700"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Layers className="size-3 text-indigo-400" />
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Entry Level" className="bg-dark-900">Entry Level</option>
                    <option value="Mid Level" className="bg-dark-900">Mid Level</option>
                    <option value="Senior Level" className="bg-dark-900">Senior Level</option>
                    <option value="Executive" className="bg-dark-900">Executive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Code2 className="size-3 text-emerald-400" />
                  Required Skills
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-700"
                    placeholder="React, Node.js, TypeScript..."
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-600 font-bold uppercase">Separate skills with commas</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <AlignLeft className="size-3 text-amber-400" />
                  Job Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all min-h-[160px] resize-none placeholder:text-gray-700"
                  placeholder="Describe the responsibilities and requirements..."
                  required
                />
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      Publish Job Posting
                      <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
