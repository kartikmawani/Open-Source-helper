Summary-:

File-:GeminiHelp.tsx,Route.ts,

Workflow->On Frontend when user will find issue that he is not able to solve it then he is supposed to use this functionality.user will pase the issue with some
         info  if he wants then front file will call the below route 
         const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/Aihelp`,{
                issueContent: issueUrl,  
            },
        This route leads to 
        Router.post('/Aihelp',Authentication,helperController)
        here Authentication middleware will check authenticity and passes the request to helperController.
        ==>export const helperController=async(req:Request,res:Response)=>{
                
                try{

                    const userId=(req.user as any)?._id
                    const {issueContent}=req.body
                    if(!issueContent || typeof issueContent!=='string'){
                    req.log.warn("Invalid issueContent");
                    return res.status(400).json({message:'Issue is not in correct format or have not reached to the controller'})
                    }
                    if(!userId){
                        req.log.warn("User ID missing");
                        return res.status(400).json({message:'User is not in correct format or have not reached to the controller'
                        })
                    }
                    const { allowed, remaining, retryAfter } = await attempt(`rate_limit:${userId}`);
                if (!allowed) {
                    return res.status(429).json({ message: "Slow down!", retryAfter });
                }
                const result=await GeminiHelp(userId,issueContent);
                SIMPLY CHECKS THE EDGE CASES and calls atempt function from redisRateLimiter.
                ==>import {getClient} from './getClient.js'

                    export interface SlidingWindowCounterConfig {
                        maxRequests: number;
                        windowSeconds: number;
                    }
                    export interface RateLimitResult {
                        allowed: boolean;
                        remaining:number|undefined;
                        limit: number;
                        retryAfter: number | null;
                    }

                    const DEFAULT_CONFIG: SlidingWindowCounterConfig = {
                        maxRequests: 10,
                        windowSeconds: 60,
                    };
                    export async function attempt(
                        key: string,
                        config: SlidingWindowCounterConfig = DEFAULT_CONFIG,
                    ): Promise<RateLimitResult> {
                        const redis = await getClient();
                        const { maxRequests, windowSeconds } = config;

                        const now = Math.floor(Date.now() / 1000);
                        const currentWindow = Math.floor(now / windowSeconds);
                        const previousWindow = currentWindow - 1;

                        // Hash tags ensure both keys map to the same cluster slot
                        const currentKey = `{${key}}:${currentWindow}`;
                        const previousKey = `{${key}}:${previousWindow}`;

                        const elapsed = (now % windowSeconds) / windowSeconds;

                        IN REDIS RATE LIMITER  it creates two interfacesSlidingWindowCounterConfig, RateLimitResult .Default config variable has set maxRequest,windowsSeconds  variables.The attempt function that we had improted at the first place requires key and config parameter which is done by using user_id
                        await attempt(`rate_limit:${userId}`);
                        Promise in the function defines how  function output should be.
                         const redis = await getClient();
                         redis client has been instantiated and  const { maxRequests, windowSeconds } = config; has been destructured so we  don't have to write
                         const maxRequests = config.maxRequests;
                            const windowSeconds = config.windowSeconds;
                            currentWindows and previousWIndows covers the one minute where application finds the total request happened.

                            const currentKey = `{${key}}:${currentWindow}`;
                             const previousKey = `{${key}}:${previousWindow}`;
                            currentKey = {${key}}:${currentWindow} and `previousKey = `{${key}}:${previousWindow}: Appends the window IDs to the base identifier (e.g., rate_limit:user123).Why the curly braces {...} matter: In a sharded Redis Cluster, keys are routed across 16,384 hash slots using a CRC16 hash of the key name. Wrapping ${key} in {...} tells Redis to hash only the substring inside the braces, guaranteeing that currentKey and previousKey always land on the exact same Redis node—preventing CROSSSLOT errors when the Lua script reads both keys simultaneously.
                            Elapsed time is used to find how much time has been passed in that one minute.
                            