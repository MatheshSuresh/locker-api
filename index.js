require("dotenv").config();
const express = require('express');
const app =express();
const userRoute=require("./routes/userRoute")
const lockerRoute = require("./routes/lockerRoute")
const cors= require('cors');
const mongo = require('./mongo');
const jwt = require('jsonwebtoken');


 (async () =>{
     try{
         
    await mongo.connect();    

    app.use(express.json());

    app.use(cors());
    
    app.use("/user",userRoute);

    // app.use((req,res,next)=>{
    //     var token=req.headers["auth"];
    //     console.log(token)
    //     try{
    //     if (token){
    //         req.user=jwt.verify(JSON.parse(token),process.env.authpass);
    //         next();
    //     }else{
    //         res.sendStatus(401);
    //     }
    //     }catch(error){
    //     console.log(error);
    // }                
    //  });

    app.use("/locker",lockerRoute);
      
    app.get('/', (req, res) => {res.send("Response From Backend")})


    const port =process.env.PORT||3001
    app.listen(port,()=>{
    console.log("Server running in port 3001")
    })
 } catch(error){
     console.log(error);
 }
})();





