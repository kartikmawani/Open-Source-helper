import React, { useState } from 'react';
import axios from "axios";

interface RoadmapResult {
  techStack: string;
  skillLevel: string;
  roadmap: string[];
  recommendations: { docName: string; docUrl:string;reason: string }[];
   
}

export const GeminiTab: React.FC = () => {
  const [issueUrl, setIssueUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoadmapResult | null>(null);

  const analyzeIssue = async () => {
    if (!issueUrl) return;
    setLoading(true);
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/Aihelp`,{
        issueContent: issueUrl,  
      },
      {withCredentials: true }
    );
      setData(response.data.response);
    } catch (error) {
      console.error("Analysis Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-slate-950 p-8 font-mono text-slate-300">
        <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-white text-2xl font-black italic tracking-tighter mb-2">NEURAL_INSTRUCTOR_v1</h2>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em]">Bridging the gap between knowledge and contribution</p>
      </div>

       
      <div className="max-w-5xl mx-auto bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 mb-12 shadow-2xl">
        <label className="block text-[9px] font-black text-blue-500 uppercase mb-4 tracking-widest">Target_Issue_Payload</label>
        <div className="flex flex-col md:flex-row gap-4">
          <textarea 
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all min-h-[100px]"
            placeholder="Paste the GitHub Issue description or URL here..."
            value={issueUrl}
            onChange={(e) => setIssueUrl(e.target.value)}
          />
          <button 
            onClick={analyzeIssue}
            disabled={loading}
            className="md:w-48 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-[10px] uppercase rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
          >
            {loading ? 'SYNCING_NEURONS...' : 'GENERATE_BLUEPRINT »'}
          </button>
        </div>
      </div>

       
      {data && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Left: Roadmap (The "How-To") */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="h-px flex-1 bg-slate-800"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase italic">Execution_Roadmap</span>
              <span className="h-px flex-1 bg-slate-800"></span>
            </div>
            
            {data.roadmap.map((step, i) => (
              <div key={i} className="group flex gap-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="text-blue-500 font-black text-xl opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                <p className="text-slate-300 text-xs leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          
          <div className="space-y-8">
            
            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10">
              <p className="text-blue-500 font-black text-[8px] uppercase tracking-widest mb-2">Detected_Stack</p>
              <p className="text-white font-bold text-sm italic">{data.techStack}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-slate-500 text-[8px] font-black uppercase tracking-tighter">Skill_Req: {data.skillLevel}</span>
              </div>
            </div>

            
            <div className="space-y-4">
              <p className="text-slate-500 font-black text-[8px] uppercase tracking-widest">Recommended_Reading</p>
              {data.recommendations.map((doc, i) => (
                                  
                <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                   <a 
                      key={i} 
                     href={doc.docUrl} 
                       target="_blank" 
                        rel="noopener noreferrer"
                         className="block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all group"
                          ></a>
                 
                 <svg className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
                  <p className="text-white font-bold text-[10px] mb-2 underline decoration-blue-500/50 underline-offset-4">{doc.docName}</p>
                  <p className="text-slate-500 text-[9px] leading-relaxed italic">"{doc.reason}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
       
    </div>
    
  );
};

 