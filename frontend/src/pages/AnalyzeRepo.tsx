import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Mock API call for the DFS Crawler
const startCrawl = async (repos: string) => {
  const { data } = await axios.post(`http://localhost:4000/analyze/${repos}`,{},
    {withCredentials:true}
  );//Skeptical
  return data;
};

 export const AnalysisView = () => {
  const { repos } = useParams<{ repos: string }>();
  const { mutate, isPending, isSuccess, data, error } = useMutation({
    mutationFn: () => startCrawl(repos || ''),
  });
  console.log("DEBUG - Mutation Data:", data);
  return (
    <div className="min-h-screen bg-[#020617] p-10 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="rounded-[2.5rem] border border-slate-800 bg-slate-950 p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <p className="text-slate-500 uppercase font-black text-[10px] tracking-widest">Active_Target</p>
              <h1 className="text-2xl text-white font-black tracking-tight">{repos}</h1>
            </div>
            <div className={`h-3 w-3 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}></div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed mb-10">
            "Ready to perform a Deep-First Search crawl. This operation will map the repository architecture and identify contribution entry points."
          </p>

          <button 
            onClick={() => mutate()}
            disabled={isPending}
            className={`w-full py-4 rounded-full border transition-all font-black uppercase tracking-[0.3em] text-[10px]
              ${isPending 
                ? 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed' 
                : 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500'
              }`}
          >
            {isPending ? 'Crawl_In_Progress...' : 'Execute Deep Scan'}
          </button>

          {/* Feedback Section */}
          <div className="mt-10 space-y-4">
            {isPending && (
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse">
                <p className="text-[10px] text-amber-500 font-black uppercase">System_Status: Crawling_Filesystem...</p>
              </div>
            )}
            
             {isSuccess && data?.aiAnalysis && typeof data.aiAnalysis === 'object' ? (
  <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20">
    <div className="flex items-center justify-between mb-6">
      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Analysis_Sync_Success</p>
      <span className="text-[9px] text-slate-500 font-mono">v2.6.stable</span>
    </div>

    <div className="space-y-6">
      <div>
        <h2 className="text-white font-black text-xl italic tracking-tighter">
          {data.aiAnalysis.techStack || 'Detecting Stack...'}
        </h2>
        <p className="text-blue-400 text-[10px] font-bold uppercase mt-1">
          Rank: {data.aiAnalysis.skillLevel || 'Pending_Assessment'}
        </p>
        <span>{data.aiAnalysis.recommendations?.map((Suggestion:any)=>{
           const githubLink=`https://github.com/${Suggestion.repoName}`;
           return( <div><span>{Suggestion.repoName}</span>
           <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 font-black text-sm tracking-tight hover:text-blue-300 hover:underline underline-offset-4 decoration-2 transition-colors flex items-center gap-2"
           >
            {Suggestion.repoName}
           </a>
           <span>{Suggestion.reason}</span>
           </div>)
        })||'repo not suggested'}</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-slate-500 font-black uppercase text-[8px] tracking-[0.3em]">Optimization_Sequence</h3>
        <ul className="space-y-2">
          {data.aiAnalysis.tips?.map((tip: string, i: number) => (
            <li key={i} className="text-slate-300 text-[10px] leading-relaxed flex gap-3 italic">
              <span className="text-emerald-500 font-bold">»</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
) : isSuccess ? (
  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
    <p className="text-amber-500 text-[10px] font-black animate-pulse">
      SCHEMA_MISMATCH: Clearing Legacy Data...
    </p>
  </div>
) : null}

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                <p className="text-[10px] text-red-500 font-black uppercase">Critical_Failure: Access_Denied</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};