import dotenv from 'dotenv';
import DatabaseConnected from './database/db.js';
import session from 'express-session'
import MongoStore from 'connect-mongo' 
import passport from 'passport'
import './services/passport.js'
import express from 'express'
import cors from 'cors'
import Router from './routes/Route.js'  
import { loggerMiddleware } from  "./middlewares/loggerMiddleware.js"
import {logger} from './utils/logger.js' 
import type {Response,Request,NextFunction} from 'express'

dotenv.config();
DatabaseConnected();
const app=express();
app.use(cors({
   credentials:true,
   origin: 'http://localhost'
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(loggerMiddleware)
app.use(session({
   resave:false,
   secret:process.env.SESSION_SECRET!,
    store: MongoStore.create({
      mongoUrl:process.env.MONGO_URI!,
      collectionName: 'sessions',      
      ttl: 14 * 24 * 60 * 60,          
       autoRemove: 'native'
    }),
   saveUninitialized:false,
    
   cookie:{
      secure:false,
      httpOnly:true,
      sameSite: 'lax',
      maxAge:1000*60*60*24
   }

}))
app.use(passport.initialize())
app.use(passport.session());
app.use('/',Router)
app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
   const statusCode=err.statusCode||500;
   logger.error(err.stack);
   res.status(statusCode).json({
      status:'error',
      message:err.isOpertaional ? err.message : 'Something went very wrong'
   })
})
const PORT=4000;
const startServer=async(PORT:string|number)=>{
   try{
     
    await DatabaseConnected();
     app.listen(PORT,()=>{
    logger.info(`Server is Running at ${PORT}`)

})
   }
  catch(error){

    logger.error({error},"Failed to run the server")
  }
   }
startServer(PORT)
 