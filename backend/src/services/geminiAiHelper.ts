import { GoogleGenerativeAI, SchemaType} from "@google/generative-ai";
import Data from '../models/user.data.model.js'
import { z } from "zod";
import {logger} from '../utils/logger.js'
 
const apiKey=process.env.GEMINI_API_KEY
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);
 
interface IUserData {
     aiAnalysis?: {
        techStack: string;
        skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
        tips: string[];
        recommendations: Array<{ repoName: string; reason: string }>;
    };
}

 const AnalysisSchema = z.object({
  techStack: z.string().describe("What technology the issue is using "),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  roadmap: z.array(z.string()).min(1).max(10),
   
  recommendations: z.array(
    z.object({
      docName: z.string(),
      docUrl: z.url(),
      reason: z.string()
    })
  ).min(1).max(5)
});  
   
 export const GeminiHelp=async(userId: string, issueContent: string)=>{
        const UserData=await Data.findOne({userId:userId}) as IUserData|null;
        const UserSkill=UserData?.aiAnalysis?.skillLevel||'Beginner';
        const  UserStack=UserData?.aiAnalysis?.techStack||'not yet Scanned'
        const model = genAI.getGenerativeModel({
    model:"gemini-flash-latest", 
    generationConfig: {
      temperature: 0.3,
      topK: 1,
      responseMimeType: "application/json",
     responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    techStack: { type: SchemaType.STRING },
                    skillLevel: { 
                        type: SchemaType.STRING, 
                        enum: ["Beginner", "Intermediate", "Advanced", "Expert"] ,
                        format: "enum"
                    },
                    roadmap: { 
                        type: SchemaType.ARRAY, 
                        items: { type: SchemaType.STRING } 
                    },
                    recommendations: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                docName: { type: SchemaType.STRING },
                                docUrl: { type: SchemaType.STRING },
                                reason: { type: SchemaType.STRING }
                            },
                            required: ["docName", "docUrl","reason"]
                        }
                    }
                },
                required: ["skillLevel", "roadmap", "recommendations","techStack"]
            }
        },
    });
  const prompt =`ACT AS: An  Instructor.
  USER CONTEXT: The user is a developer which skill  is :${UserSkill} and stack is ${UserStack}.
 
   TASK:
   1.Identify the skill level of the issue and compare the skill level with.
   2.Suggest the roadmap to solve the issue.
   3.Suggest documentation which has information about the topic which is required to solve the issue.
   4.The technology the issue is using 
   IMPORTANT: Provide the actual valid URL (docUrl) to the specific page 
     that helps solve this issue
   TARGET ISSUE: ${issueContent}
   CONSTRAINTS:
    -Do not show the code that directly solve the issue.` 
    try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    logger.info("Roadmap generated Succesfully")
    
     
    const rawJSON = JSON.parse(response.text());
    return AnalysisSchema.parse(rawJSON); 
  } catch (err) {
     logger.error({ 
        err, 
        issueSnippet: issueContent.substring(0, 50) // Contextual data
    }, "Gemini Instructor Pipeline Failed");
     
  }
};