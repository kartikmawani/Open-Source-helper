 import type { Request, Response } from 'express';

 
interface GitHubUser {
  username: string;
  githubId: string;
   
}

declare global {
  namespace Express {
    interface User extends GitHubUser {}
  }
}

export const refreshController = (req: Request, res: Response) => {
  
  try{if (req.isAuthenticated() && req.user) {
    const { username, githubId } = req.user;

    return res.status(200).json({
      loggedIn: true,
      username,
      githubId
       
    });
  }
}
 catch(err){
  req.log.error({err},"request is not authenticated or user is not found")
  return res.status(400).json({ 
    loggedIn: false, 
    user: null 
  });
}
};