const route = require('express').Router();
const service = require("../services/locker.services");

route.post("/insertlocker", service.newLocker);
route.post("/unlock", service.unlock);
route.get("/lockerdata", service.lockerdata);
route.post("/unlockupdate", service.Updatedata)
route.get("/occupied", service.Occupied)

module.exports = route;