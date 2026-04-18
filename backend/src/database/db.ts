import mongoose from "mongoose"

async  function DatabaseConnected(){
   const uri=process.env.MONGO_URI;
   if(!uri){
    throw new Error("MONGO_URI is not defined")
   }
    mongoose.connect(uri,{}).then(
      ()=>( console.log("database connected"))
    ).catch( (error)=>{ console.log(error)})

}
export default DatabaseConnected