const route=require('express').Router();
const mongo = require("../mongo");
const service=require("../services/user.services");

route.post('/register',service.register);
route.post('/login',service.login)
route.get('/check',service.check)
route.post('/update',service.update)
route.get('/viewall',service.viewall)
route.post('/view',service.view)
route.post('/createpasscode',service.createPasscode)
module.exports = route;