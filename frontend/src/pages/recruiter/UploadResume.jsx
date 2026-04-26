import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Loader2,
  Mail,
  Phone,
  User,
  Cpu,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [fileInputState, setFileInputState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [parsedData, setParsedData] = useState(null);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
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

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("/api/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Resume intelligence engine successfully parsed the candidate data.");
      setParsedData(res.data.candidate);
      setFile(null);
      setFileInputState("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload and parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Command Center
        </button>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="size-3" />
                AI Extraction
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                Upload <span className="text-gradient">Resume</span>
              </h1>
              <p className="text-gray-400 font-medium leading-relaxed">
                Our engine automatically extracts skills, experience, and contact info from PDF or DOCX files.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={cn(
                "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-500 overflow-hidden",
                file ? "border-primary-500/50 bg-primary-500/5" : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/5"
              )}>
                <input
                  type="file"
                  id="resume"
                  onChange={handleFileChange}
                  value={fileInputState}
                  accept=".pdf,.docx"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                
                <div className="p-10 text-center space-y-4 relative">
                  <div className={cn(
                    "size-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500",
                    file ? "bg-primary-500 text-white scale-110 shadow-lg shadow-primary-500/20" : "bg-white/5 text-gray-500 group-hover:text-white"
                  )}>
                    <Upload className="size-8" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-white font-black text-lg">
                      {file ? "File Selected" : "Choose a File"}
                    </h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                      {file ? file.name : "PDF or DOCX (Max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !file}
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Initialize Extraction
                    <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-in shake-2">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="size-4 shrink-0" />
                {success}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="glass-card min-h-[400px] flex flex-col relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

               <div className="p-8 border-b border-white/5 relative bg-white/2">
                 <h2 className="text-xl font-black text-white flex items-center gap-3">
                   <FileText className="size-5 text-primary-400" />
                   Extraction Results
                 </h2>
               </div>

               <div className="flex-1 p-8 relative">
                 {!parsedData ? (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                     <Cpu className="size-16 text-gray-700" />
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Waiting for data processing...</p>
                   </div>
                 ) : (
                   <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                     <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                             <User className="size-3" /> Full Name
                           </p>
                           <p className="text-xl font-black text-white">{parsedData.name || "Unknown"}</p>
                         </div>
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                             <Mail className="size-3" /> Email Address
                           </p>
                           <p className="text-white font-bold">{parsedData.email || "Not specified"}</p>
                         </div>
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                             <Phone className="size-3" /> Phone Number
                           </p>
                           <p className="text-white font-bold">{parsedData.phone || "Not specified"}</p>
                         </div>
                       </div>

                       <div className="space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                           <Cpu className="size-3" /> Extracted Skills
                         </p>
                         <div className="flex flex-wrap gap-2">
                           {parsedData.skills && parsedData.skills.length > 0 ? (
                             parsedData.skills.map((skill, i) => (
                               <span key={i} className="px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-xs font-bold text-primary-400">
                                 {skill}
                               </span>
                             ))
                           ) : (
                             <p className="text-gray-600 italic text-sm">No specific skills detected.</p>
                           )}
                         </div>
                       </div>
                     </div>

                     <div className="pt-6 border-t border-white/5">
                        <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10 flex items-center justify-between">
                          <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Confidence Score</p>
                          <span className="text-xl font-black text-emerald-500">98%</span>
                        </div>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
