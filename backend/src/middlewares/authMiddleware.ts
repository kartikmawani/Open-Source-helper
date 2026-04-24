import  type {Request,Response,NextFunction} from 'express'
import User from '../models/user.models.js'

 
 export const  Authentication = async(req:Request, res:Response, next:NextFunction) => {
    // 1. Log to confirm it's being hit (check docker logs -f backend)
    if (process.env.NODE_ENV === 'test') {
        // Find the actual user in the DB to get the Mongoose _id
        const user = await User.findOne({ githubId: "184488875" });
        
        if (user) {
            req.user = user; // This attaches the REAL _id, githubId, etc.
            //@ts-ignore
            req.isAuthenticated = () => true;
            return next();
        }
        console.error("❌ Test User 184488874 not found in DB. Seed it first!");
    }
    // 3. Normal Authentication
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
};
 