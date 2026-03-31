import axios from 'axios';
import Data from '../Models/user.data.model.js';  

interface GithubRepo{
  name:string;
  id:number;
  private:boolean;
}

export const fetchRepos = async (accessToken:string,userId:string) => {
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