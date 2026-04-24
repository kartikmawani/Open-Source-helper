import type  { Request, Response } from 'express';
import * as FileSaving from '../services/githubFileScanner.js'
import * as FileContent from '../services/reqFileContent.js'
import * as AIAnalysis from '../services/geminiAiAnalysis.js'
import Data from '../models/user.data.model.js'

interface AuthRequest extends Request {
    user?: {
        githubId: string;
        username:string;
        _id: string;
        accessToken: string;
    };
}
 export const logicController=async(req:Request,res:Response)=>{
   try{ 
        const authReq = req as AuthRequest;
         if (!authReq.user) {
                req.log.warn("No user found");
                return res.status(401).json({ message: "No user found in request." });
       }
       const { repoName } = req.params;
       const {githubId,_id:userId}=authReq.user

       if (!repoName || typeof repoName !== 'string') {
             req.log.warn("Repository name is not found in the url")
            return res.status(400).json({ message: "Repository name is required in the URL." });
        }
       await FileSaving.fileScanner(githubId,repoName)
       const decodedCode = await FileContent.contentForAnalysis(githubId,repoName);
       if(!decodedCode||decodedCode.length==0){
          req.log.warn("Unable to fetch data from github")
         return res.status(404).json({message:"There is an Error Fetching the data from github"})
       }
       const formattedCode = decodedCode.map(file => `FILE: ${file.fileName}\nCONTENT:\n${file.code.substring(0, 3000)}`) // Truncate at 3k chars
         .join("\n\n---\n\n");
       const result=await AIAnalysis.contentToGemini(formattedCode)
        if (!result) {
            throw new Error("AI Analysis returned empty result");
        }
    await Data.findOneAndUpdate(
        {userId:userId},
        {$set:{aiAnalysis:result}}
    )
    res.status(200).json({
        message:"The Suggestion is Completed",
        aiAnalysis:result
    })
    console.log(result)
}
catch(err){
     req.log.error({err},"Unable to perform file Scanning or Analysis")
    res.status(500).json({
        message:"Failed to Perform the Analysis",
    })
}
}