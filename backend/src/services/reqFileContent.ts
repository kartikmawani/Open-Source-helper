import Data from '../Models/user.data.model.js'
import axios from 'axios'
import User from '../Models/user.models.js';
import {logger} from '../utils/logger.js' 
  interface GitHubItem {
  name: string;
  path: string;
  type: "dir" | "file";  
  content: string;  
}
interface Decodedfile{
    fileName:string;
    code:string;
}
//here repos variable is repo
 export const contentForAnalysis=async(githubId:string,repo:string)=>{
    try{
    const user=await User.findOne({githubId})
    if (!user) {
             logger.info("No user found")
            throw new Error(`User with GitHub ID ${githubId} not found.`);
        }
    const userData=await Data.findOne({userId:user._id})
    if (!userData || !userData.repoNames || userData.repoNames.length === 0) {
           logger.info("Repository not found")
            throw new Error("No repository data found for this user.");
        }
   
      const  owner=user.username
      
      const accessToken=user.accessToken;
      //For of loop is slow it will work one by one but Promise.all will do the work parallelsy reduces by /nth time 
      //Promisea.all reduces latency and does I/O concurency it returns an array
      const fetchPromises = userData.fileNames.map(async (file) => {
      const response = await axios.get<GitHubItem>(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'OpenSource-Helper',
            'Accept': 'application/vnd.github+json'
          }
        }
      );

       
      return {
        fileName: file.name ?? 'unnamed_file',
        code: Buffer.from(response.data.content, 'base64').toString('utf-8')
      };
    });
      logger.info("dfs crawling is complete")
     const result:Decodedfile[]=await Promise.all(fetchPromises)
     return result;
    }
     catch(error){
        logger.error({err:error},"Failed to get the file Content");
    }
    
    
}