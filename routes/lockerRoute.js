const route = require('express').Router();
const service = require("../services/locker.services");

route.post("/insertlocker", service.newLocker);
route.post("/unlock", service.unlock);
route.get("/lockerdata", service.lockerdata);
route.post("/unlockupdate", service.Updatedata)
route.get("/occupied", service.Occupied)
route.post("/updateuser", service.Updateuser)
route.post("/updatealldata", service.Updatealldata)
route.get("/logdata", service.logdata)
route.post("/logdatalocker", service.logdataone)
route.post("/deletedata", service.deletedata)

module.exports = route;