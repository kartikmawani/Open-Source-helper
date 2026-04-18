import {GeminiHelp} from '../src/services/geminiAiHelper.js'
import type {Request,Response} from 'express'
import {attempt} from '../utils/redisRateLimit.js'

export const helperController=async(req:Request,res:Response)=>{
     
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

   //  // ATTACHMENT 2: Caching
   //  const cachedData = await getCachedBlueprint(issueId);
   //  if (cachedData) return res.json(cachedData);
      
     const result=await GeminiHelp(userId,issueContent);
      req.log.info({ result }, "Gemini response received");
     res.status(200).json({
        response:result,
        message:"RoadMap suggested Successfully"
     })
}
 catch(err:any){
    req.log.error({ err }, "Error in helperController");
   return res.status(500).json({ 
            message: "Internal Server Error during AI analysis",
            error: err.message 
        });


}
}