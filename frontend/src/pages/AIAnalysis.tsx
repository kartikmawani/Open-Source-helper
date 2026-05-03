import axios from 'axios'
import {useQuery} from '@tanstack/react-query'
// no try catch tanstack handles it
 export const Analysis=async()=>{
   const {isPending,isError,data}=useQuery({
      queryKey:['repos'],
      queryFn:repoFetch
   })
   if (isPending) { 
      return (
    <div className="flex items-center justify-center h-20 animate-pulse text-blue-500 font-mono text-xs">
       fetching...
    </div>
  );
}
   if(isError){
      return (
    <div className="flex items-center justify-center h-20 animate-pulse text-blue-500 font-mono text-xs">
      Error Loding Data...
    </div>
  );
   }
   return (
      <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl">
       <h2 className="text-blue-500 font-black uppercase tracking-widest text-[10px] mb-4">Detected Repositories</h2>
       <div className="space-y-2">
         
          {data?.repoNames?.map((repo: string, index: number) => (
            <div key={index} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-[10px] hover:border-blue-500/50 transition-colors">
              <span className="text-slate-500 mr-2">{index + 1}.</span> {repo}
            </div>
          ))}
       </div>
    </div>
   )
}
const repoFetch=async()=>{
  
  const result=await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/repos`,{
   withCredentials:true//It is required otherwise the backend will not recognize it 
  })
  return result.data
  
  
}