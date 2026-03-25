import mongoose from "mongoose";
const user=new mongoose.Schema({
      username:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true,
        unique:true
      },
     githubId:{
      type:String,
      required:true,
      unique:true,
     },
     avatarUrl:{
      type:String,
     },
     
     accessToken:{
      type:String,
      required:true,
        //select:false; will not allow even the developer to see ;so you have to use interface to work because
       //it is required for security
     },
     FileData:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Data'
     }
})

const User=mongoose.model('User',user);
export default User;