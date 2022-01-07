require("dotenv").config();
const express = require('express');
const app =express();
const cors= require('cors');
const lockerRoute = require("./routes/lockerRoute")


    app.use(express.json());

    app.use(cors());
    
    app.use("/locker",lockerRoute)

    const port =process.env.PORT||3001
    app.listen(port,()=>{
    console.log("Server running in port 3001")
    })





