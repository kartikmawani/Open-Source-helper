Summary-:

File-:

WorkFlow-:After Login the project it  will redirect you to /repos where  Authentication middleware will check the authenticity of the user because it is  
         protected route.It will save the  user if it is valid.
         ==>export const  Authentication = async(req:Request, res:Response, next:NextFunction) => {
                    
                    if (process.env.NODE_ENV === 'test') {
                        
                        const user = await User.findOne({ githubId: "184488875" });
                        
                        if (user) {
                            req.user = user; // This attaches the REAL _id, githubId, etc.
                            //@ts-ignore
                            req.isAuthenticated = () => true;
                            return next();
                        }   
                    }
                    if (req.isAuthenticated && req.isAuthenticated()) {
                        return next();
                    }

                    return res.status(401).json({ message: "Unauthorized" });
                };

            Will Check the user in database if it exists then req.user will have the user and it will be considered authenticated
            Improvement-:Currently works in Test enviornment.
                        Hardcoded githubID.
                        Database query can be lean and Indexing can be performed
            
            ==> export const githubController=async(req:any,res:any)=>{
                    try{ 
                        //req.body is not safe req.user is safe bcoz the user is authenticated using middleware
                        const freshUser = await User.findById(req.user._id);
                        if (!freshUser || !freshUser.accessToken||!freshUser._id) {
                            req.log.warn("No  access Token is found ")
                        throw new Error("No access token found in database.");
                        }
                        const repoList= await githubRepoService.fetchRepos(freshUser.accessToken,freshUser._id.toString())
              Inside the github controller it will first  check is it a freshUser by checking it agains database if there is accessToken,user.id then it will
              proceed to githubRepoService function where it will require 2 parameter that is inside the freshUser object .
              ==>export const fetchRepos = async (accessToken:string,userId:string) => {
                    try {
                        
                        const response = await axios.get<GithubRepo[]>('https://api.github.com/user/repos', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`, 
                            'Accept': 'application/vnd.github+json',//tells github to send data in json format
                            'User-Agent': 'OpenSource-Helper' 
                        },
                        params: {
                            visibility:'public', 
                            sort: 'updated',
                            per_page: 100
                        }
                        });

                        
                        const cleanRepos = response.data.map((repo: any) => repo.name );

                    
                        await Data.findOneAndUpdate({userId:userId},
                        { $set: {repoNames: cleanRepos }},
                        {upsert:true,new:true}
                        );

                        console.log(`Successfully synced ${cleanRepos.length} repos.`);
                        return cleanRepos;
                    } catch (error: any) {
                        console.error("GitHub Sync Failed:", error.response?.data || error.message);
                        throw new Error("Failed to fetch repositories.");
                    }
                    };
                    THE GITHUB REPO SERVICE function will call the github api with some header and scope range result will be saved in an array that is later
                    mapped for clead response.User repo list will be saved or updated based on the situation,it will update or add new data in the repoNames
                    if upsert true is implied.
                    Improvements-:Centralized error is not used.
                                   api call standard is not maintained.
                                   Mongodb operartion may done using lean and indexing. 

                WHEN THE BACKEND return response will clead repo object then frontend do mapping on that using tanstack query
                ==>const queryClient = useQueryClient();
                    const { data: repos, isLoading: isInitialLoading } = useQuery({
                        queryKey: ['repos'],
                        queryFn: async () => {
                        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repos`, { withCredentials: true });
                        return res.data.repos; 
                        }
                    });
            
                    const syncMutation = useMutation({
                        mutationFn: async () => {
                        return await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repos`, { withCredentials: true });
                        },
                        onSuccess: () => {
                        
                        queryClient.invalidateQueries({ queryKey: ['repos'] });
                        }
                USEQUERYCLIENT() function connects to global queryClient that gives ability to update ,cache ,delete things.
                useQuery has renames data and isLoading then queryKey is set to repos which is the key that is checked when tanstack query wants to serve cached
                data .queryFn is responsible to make api call on backend.
                useMutation is used when you press the button which is unlike to useQuery that runs automatically.useMutation calls the api using mutationFn
                and based on the result on of the  following response is shown on the ui.
                ==> if (isLoading) {
                        return (
                        
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest animate-pulse">
                            Loading...
                            </p>
                            
                        </div>
                        );
                    }

                    
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
                    IF IT IS LOADING then ifLoading component will be shown if repo is not fetched or repo length is 0 then second component will be fetchede giving  a button to fetch repos using mutation if everyThing goes as intended then list of cards will be shown that has reponame in it and an button to analyize the repo.
           
