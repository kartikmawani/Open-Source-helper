import  type {Request,Response,NextFunction} from 'express'

export const Authentication=(req:Request,res:Response,next:NextFunction)=>{
    if(typeof req.isAuthenticated==='function' && req.isAuthenticated()){
        return next();
    }
    else{
        return res.status(401).json({
            authenticated:false,
            message: "Unauthorized: Please log in via GitHub" 

        })
    }
}
 