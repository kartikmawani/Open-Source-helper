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
        type:String,
        default:"This line indicates that Analysis has not been saved/done properly",
     }

})
const Data=mongoose.model('Data',data)
export  default Data