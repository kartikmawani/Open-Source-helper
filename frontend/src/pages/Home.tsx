import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {Link} from 'react-router-dom'

export const HomeTab = () => {
  const queryClient = useQueryClient();

  // 1. Fetching the existing list from your DB/Cache
  const { data: repos, isLoading: isInitialLoading } = useQuery({
    queryKey: ['repos'],
    queryFn: async () => {
      const res = await axios.get('http://localhost/api/repos', { withCredentials: true });
      return res.data.repos; //  
    }
  });

  // 2. The Mutation to trigger a NEW sync from GitHub
  const syncMutation = useMutation({
    mutationFn: async () => {
      return await axios.get('http://localhost/api/repos', { withCredentials: true });
    },
    onSuccess: () => {
      // Refresh the list after syncing
      queryClient.invalidateQueries({ queryKey: ['repos'] });
    }
  });

  const isLoading = isInitialLoading || syncMutation.isPending;

  // --- RENDERING LOGIC ---

  // STATE A: Loading (Spinner)
  if (isLoading) {
    return (
      
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest animate-pulse">
          Crawling_GitHub_API...
        </p>
          
      </div>
    );
  }

  // STATE B: Empty (Show Sync Button)
  if (!repos || repos?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-900 rounded-[40px]">
        <h2 className="text-white font-black text-xl mb-2 italic">No Repositories Found</h2>
        <p className="text-slate-500 text-[10px] mb-8 uppercase">Initialize connection to fetch source data</p>
        <button 
          onClick={() => syncMutation.mutate()}
          className="px-10 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]"
        >
          Sync GitHub Repos
        </button>
      </div>
    );
  }

  // STATE C: Data Ready (Show Grid)
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white italic">Source Inventory</h2>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Select a project to initiate Gemini Analysis</p>
        </div>
        <button 
          onClick={() => syncMutation.mutate()}
          className="text-[8px] font-black uppercase text-blue-500 hover:text-blue-400 border-b border-blue-500/20 pb-1"
        >
          Re-Sync Items
        </button>
      </div>

      {/* REPO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((name: string, i: number) => (
          <div key={i} className="group p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer">
             <div className="flex justify-between items-start mb-4">
                <span className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">Repo_0{i + 1}</span>
                <div className="h-2 w-2 rounded-full bg-slate-800 group-hover:bg-blue-500 transition-colors"></div>
             </div>
             <h3 className="text-white font-bold text-sm truncate mb-4">{name}</h3>
             <button  >
               Analyze Repository
             </button>
             
  <button className="w-full py-2 bg-slate-950 rounded-xl border border-slate-800 text-[8px] font-black uppercase text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all" >
     <Link to={`/analyze/${name}`}>Analyze Repository</Link>
  </button>
 
          </div>
        ))}
      </div>
    </div>
  );
};