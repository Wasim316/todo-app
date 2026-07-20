const mongoose = require("mongoose");

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connection to db is successfull")
    }catch(err){
        console.log("db not connected : ", err)
    }
   
};

module.exports = dbConnection;