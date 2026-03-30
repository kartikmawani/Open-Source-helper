import { GoogleGenerativeAI, SchemaType} from "@google/generative-ai";
import { z } from "zod";
//Rate limit is decide as per project not wrt API key 
//Sometimes the api can be in high demand so you should add retry way if this happens
const apiKey=process.env.GEMINI_API_KEY
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);
interface DecodedFile {
    fileName: string;
    code: string;
}

 const AnalysisSchema = z.object({
  techStack: z.string().describe("The primary languages and frameworks found"),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  tips: z.array(z.string()).min(1).max(5),
  recommendations: z.array(
    z.object({
      repoName: z.string(),
      reason: z.string()
    })
  ).length(3)
});
 
 export const contentToGemini=async(userGithubCode:string)=>{
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
                    tips: { 
                        type: SchemaType.ARRAY, 
                        items: { type: SchemaType.STRING } 
                    },
                    recommendations: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                repoName: { type: SchemaType.STRING },
                                reason: { type: SchemaType.STRING }
                            },
                            required: ["repoName", "reason"]
                        }
                    }
                },
                required: ["techStack", "skillLevel", "tips", "recommendations"]
            }
        },
    });
  const prompt =`ACT AS: An Open-Source Contribution Scout.
  USER CONTEXT: The user is a developer with the following codebase: ${userGithubCode}
  
  TASK:
  1. Analyze the user's tech stack and code quality.
  2. Identify 3 ACTIVE open-source repositories on GitHub where the user can actually CONTRIBUTE code.
  
  CONSTRAINTS:
  - DO NOT suggest "Best Practice" guides, documentation-only repos, or educational templates.
  - DO NOT suggest the core libraries themselves (e.g., don't suggest contributing to React or Vite directly).
  - DO suggest real-world applications, tools, or middle-ware projects that use the user's stack (MERN/Vite/Tailwind).
  - The "reason" must explain a specific area of the project where the user's current skills would be useful (e.g., "They need help with React 19 transitions which you are already using").
  
  OUTPUT: Provide the response in the specified JSON format.`
    try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // Parse the response text as JSON and then validate with Zod
    const rawJSON = JSON.parse(response.text());
    return AnalysisSchema.parse(rawJSON); 
  } catch (err) {
    console.error("Analysis Pipeline Failed:", err);
  }
};