const db = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const service = {
    async register(req, res) {
        try {
            const user = await db.userauth.findOne({ email: req.body.email })
            if (user) return res.status(400).send({ error: "User already exist" })

            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            await db.userauth.insertOne(req.body);

            res.send({ message: "user registered successfully" })
            console.log("user registered successfully")

        } catch (error) {
            console.log("Error Registering User - ", error);
            res.sendstatus(500)
        }
    },

    async login(req, res) {
        try {
            const user = await db.userauth.findOne({ email: req.body.email })
            if (!user) return res.status(400).send({ error: "User not exist" })

            const isValid = await bcrypt.compare(req.body.password, user.password);
            if (!isValid) return res.status(403).send({ error: "Email or Password Not Exist" })

            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.authpass, { expiresIn: '2h' })
            res.header('auth', token).send(token);

        } catch (error) {
            console.log("Error login User - ", error);
            res.status(500);
        }
    },

    async check(req, res) {
        try {
            const data = await db.userauth.find().toArray();
            res.status(200).send(data);

        } catch (err) {
            res.status(500)
        }
    },

    async update(req, res) {
        const salt = await bcrypt.genSalt(10);
        var status = await bcrypt.hash(req.body.password, salt);
        try {
          const data = await db.lockerData.findOneAndUpdate({ email: req.body.email }, { $set: { password: status } }).then((res) => { return res }).catch((err) => { throw err.message })
          res.send(data);
        } catch (err) {
          res.status(500)
        }
      },
    
      async viewall(req, res){
          try{
            const data = await db.userauth.find().toArray()
              res.send(data)
          }catch(err){
            res.status(500)
          }
      },

      async view(req, res){
        try{
          const data = await db.userauth.find({email: req.body.email}).toArray()
            res.send(data)
        }catch(err){
          res.status(500)
        }
    },

    async createPasscode(req,res){
        try{
            const data = await db.userauth.findOneAndUpdate({ email: req.body.email }, { $set: { passcode: req.body.passcode } })
              res.send(data)
          }catch(err){
            res.status(500)
          }
    }
}

module.exports = service;