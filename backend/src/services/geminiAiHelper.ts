import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Data from '../models/user.data.model.js';
import { z } from "zod";
import { logger } from '../utils/logger.js';

const apiKey = process.env.GEMINI_API_KEY;
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

// Fixed: Changed z.url() to z.string() because Gemini often omits 'https://'
// which causes Zod to throw an error and crash the response.
const AnalysisSchema = z.object({
    techStack: z.string(),
    skillLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
    roadmap: z.array(z.string()).min(1).max(10),
    recommendations: z.array(
        z.object({
            docName: z.string(),
            docUrl: z.string(), 
            reason: z.string()
        })
    ).min(1).max(5)
});

export const GeminiHelp = async (userId: string, issueContent: string) => {
    const UserData = await Data.findOne({ userId: userId }) as IUserData | null;
    const UserSkill = UserData?.aiAnalysis?.skillLevel || 'Beginner';
    const UserStack = UserData?.aiAnalysis?.techStack || 'Not yet Scanned';

    // Fixed: Using the specific stable model version
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
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
                        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
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
                            required: ["docName", "docUrl", "reason"]
                        }
                    }
                },
                required: ["skillLevel", "roadmap", "recommendations", "techStack"]
            }
        },
    });

    const prompt = `ACT AS: A Senior Technical Instructor.
    USER CONTEXT: Skill Level: ${UserSkill}, Primary Stack: ${UserStack}.
    
    TASK:
    1. Analyze this GitHub issue: "${issueContent}"
    2. Identify the technology stack of the issue.
    3. Suggest a step-by-step roadmap to solve it.
    4. Provide specific documentation links (URLs) for the required topics.
    
    CONSTRAINTS:
    - Do not provide code that directly solves the issue.
    - Ensure all docUrls are valid strings.`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        logger.info("Gemini response received. Validating schema...");
        
        const rawJSON = JSON.parse(responseText);
        return AnalysisSchema.parse(rawJSON); 

    } catch (err) {
        logger.error({ 
            err, 
            issueSnippet: issueContent.substring(0, 50) 
        }, "Gemini Instructor Pipeline Failed");

        // Fixed: Return a fallback object so the frontend doesn't receive 'undefined'
        return {
            techStack: "Analysis Failed",
            skillLevel: UserSkill,
            roadmap: ["The AI could not generate a roadmap at this time. Please check your API key or connection."],
            recommendations: [{
                docName: "Error Documentation",
                docUrl: "https://ai.google.dev/gemini-api/docs",
                reason: "System was unable to parse the AI response."
            }]
        };
    }
};