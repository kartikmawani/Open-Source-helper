import axios from 'axios'
import Data from '../models/user.data.model.js'
import User from '../models/user.models.js';
import {logger} from '../utils/logger.js' 
  interface GitHubItem {
  name: string;
  path: string;
  type: "dir" | "file";  
  content?: string;  
}
 export const fileScanner=async(githubId:string,repos:string)=>{
    try{
     
 const user=await User.findOne({githubId})
              if (!user) {
              logger.warn("User is not found")    
            throw new Error(`User with GitHub ID ${githubId} not found.`);
        }
 const  reqData=await Data.findOne({userId:user._id})
   if (!reqData || !reqData.repoNames|| reqData.repoNames.length === 0) {
               logger.warn("Repository is not found ")
            throw new Error("No repository data found for this user.");
        }
  reqData.set('fileNames', []);
  const  owner=user.username
  const accessToken=user.accessToken;
 
 
 await dfsCrawler(owner,repos,"",reqData,accessToken)
 await reqData.save()
    }
    catch(error){
         logger.error({err:error},"Scanner wrapping failed")
    }
}
 const dfsCrawler=async(owner:string,repo:string,path:string,reqData:any,accessToken:string)=>{
    //const content=[]
     if(!repo){
        logger.info("repo not found")
         return;
     }
     try{

     const  {data:items}= await axios.get<GitHubItem[]>(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
        headers: { 
          Authorization: `Bearer ${accessToken}`,  
          'User-Agent': 'OpenSource-Helper',
          'Accept':'application/vnd.github+json'//It is the  default github Api respose  
        }
    }
     )
    const requiredFile=["Readme.md","App.js","package.json","App.ts"];
    const IGNORED_ITEMS = ['node_modules', '.git', 'dist', '.env']; 
    for(const  item of items){
        if(IGNORED_ITEMS.includes(item.name)){
                continue;
            }
            if (item.type === 'file') {
            const isRequired = requiredFile.some(req => req.toLowerCase() === item.name.toLowerCase());
        
        if (isRequired) {
          reqData.fileNames.push({ name: item.name, path: item.path });
          logger.info(`${item.path}`);
        }
    }
        else if(item.type==='dir'){
               await  dfsCrawler(owner,repo,item.path,reqData,accessToken)
            }
             
        
    }
 }
 catch(error){
    logger.error({err:error},"Unable to perform operation on github files")
 }
}


