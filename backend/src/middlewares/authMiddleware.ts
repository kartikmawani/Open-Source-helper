import  type {Request,Response,NextFunction} from 'express'
import User from '../models/user.models.js'

 
 export const  Authentication = async(req:Request, res:Response, next:NextFunction) => {
    
    if (process.env.NODE_ENV === 'test') {
        
        const user = await User.findOne({ githubId: "184488875" });
        
        if (user) {
            req.user = user; // This attaches the REAL _id, githubId, etc.
            //@ts-ignore
            req.isAuthenticated = () => true;
            return next();
        }
         
    }
     
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
};
 