const route = require('express').Router();
const service = require("../services/locker.services");

route.post("/unlock",service.unlock);

module.exports = route;