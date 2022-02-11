const route=require('express').Router();
const mongo = require("../mongo");
const service=require("../services/user.services");

route.post('/register',service.register);
route.post('/login',service.login)
route.get('/check',service.check)
route.post('/update',service.update)
module.exports = route;