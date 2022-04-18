require("dotenv").config();
const express = require('express');
const app = express();
const userRoute = require("./routes/userRoute")
const lockerRoute = require("./routes/lockerRoute")
const cors = require('cors');
const mongo = require('./mongo');
const path = require("path")
const jwt = require('jsonwebtoken');

app.use("/download", express.static(path.join(__dirname + "/download")))
const ConnectionHandler = require('./connHandler');

(async () => {
    try {

        await mongo.connect();

        app.use(express.json());

        app.use(cors());

        app.use("/user", userRoute);

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

        app.use("/locker", lockerRoute);

        app.get('/', (req, res) => { res.send("Response From Backend") })
        app.get('/machineStatus1', (req, res) => {
            const { ip, port, type, address } = req.query;
            console.log(ip, port, type, address);
            try {
                switch (type) {
                    case "status":
                        ConnectionHandler.Status(ip, port, address, (d) => {
                            if(d) res.send(d);
                            else res.sendStatus(503);
                        });
                        break;
                    case "operate":
                        ConnectionHandler.Open(ip, port, address, (d) => {
                            res.sendStatus(d ? 200 : 503);
                        });
                        break;
                }
            }
            catch (err) {

            }
        })
        app.get('/machineStatus2', (req, res) => {
            const { ip, port, type, address } = req.query;
            console.log(ip, port, type, address);
            try {
                switch (type) {
                    case "status":
                        ConnectionHandler.Status(ip, port, address, (d) => {
                            if(d) res.send(d);
                            else res.sendStatus(503);
                        });
                        break;
                    case "operate":
                        ConnectionHandler.Open(ip, port, address, (d) => {
                            res.sendStatus(d ? 200 : 503);
                        });
                        break;
                }
            }
            catch (err) {

            }
        })

        app.get('/openLock', (req, res) => {
            const { ip, port, type, address } = req.query;
            console.log(ip, port, type, address);
            try {
                switch (type) {
                    case "status":
                        ConnectionHandler.Status(ip, port, address, (d) => {
                            if(d) res.send(d);
                            else res.sendStatus(503);
                        });
                        break;
                    case "operate":
                        ConnectionHandler.Open(ip, port, address, (d) => {
                            res.sendStatus(d ? 200 : 503);
                        });
                        break;
                }
            }
            catch (err) {

            }
        })












        const port = process.env.PORT || 3001
        app.listen(port, () => {
            console.log("Server running in port 3001")
        })
    } catch (error) {
        console.log(error);
    }
})();





