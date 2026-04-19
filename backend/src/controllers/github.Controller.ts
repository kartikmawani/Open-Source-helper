import * as githubRepoService from '../services/github.permission.js'
import User from '../models/user.models.js'
 export const githubController=async(req:any,res:any)=>{
   try{ 
    //req.body is not safe req.user is safe bcoz the user is authenticated using middleware
     const freshUser = await User.findById(req.user._id);
    if (!freshUser || !freshUser.accessToken||!freshUser._id) {
        req.log.warn("No  access Token is found ")
      throw new Error("No access token found in database.");
    }
    const repoList= await githubRepoService.fetchRepos(freshUser.accessToken,freshUser._id.toString())
     res.status(200).json({
        message:"Repos  synced SuccessFully",
        repos:repoList
     })
    }
    catch(err:any){
         req.log.error("Error making the request ",{err})
        res.status(500).json({
            err:err.message,
            message:"Failed to Sync"
        })
    }
}