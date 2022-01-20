const route = require('express').Router();
const service = require("../services/locker.services");

route.post("/insertlocker",service.newLocker);
route.post("/unlock",service.unlock);
route.get("/lockerdata",service.lockerdata);

module.exports = route;