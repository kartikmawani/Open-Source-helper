import mongoose, { Schema } from "mongoose"
const fileName=new Schema({
    name:{
        type:String,
       
    },
    path:{
        type:String,
         
    },

})
 
const data= new mongoose.Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },  
    repoNames:{
        type:[String],
        default:[]
        
    },
     fileNames:{
        type:[fileName],
        default:[]
     },
     aiAnalysis:{
         techStack: String,
    skillLevel: String,
    tips: [String],
    recommendations: [
      {
        repoName: String,
        reason: String
      }
    ]
     }

})
const Data=mongoose.model('Data',data)
export  default Data