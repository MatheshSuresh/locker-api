const db = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require("fs")
const util = require("util")
const removeFile = util.promisify(fs.unlink)

const service = {
  async register(req, res) {
    try {
      const user = await db.userauth.findOne({ email: req.body.email })
      // if (user) return res.status(400).send({ message: "User already exist" })
      if (user) return res.send({ message: "User already exist" })

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
      if (!user) return res.send({ error: "User not exist" })

      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid) return res.send({ error: "Email or Password Not Exist" })

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

  async viewall(req, res) {
    try {
      const data = await db.userauth.find().toArray()
      res.send(data)
    } catch (err) {
      res.status(500)
    }
  },

  async view(req, res) {
    try {
      const data = await db.userauth.find({ email: req.body.email }).toArray()
      res.send(data)
    } catch (err) {
      res.status(500)
    }
  },

  async createPasscode(req, res) {
    try {
      const data = await db.userauth.findOneAndUpdate({ email: req.body.email }, { $set: { passcode: req.body.passcode } })
      res.send(data)
    } catch (err) {
      res.status(500)
    }
  },
  async deleteuser(req, res) {
    try {
      const data = await db.userauth.deleteOne({ "email": req.body.email })
      res.send(data)
    } catch (err) {
      res.status(500)
    }
  },
  async Updatealldata(req, res) {
    try {
      const data = await db.userauth.updateMany({ email: req.body.email }, { $set: req.body });

      res.status(200).send(data);

    } catch (err) {
      res.status(500)
    }
  },
  async export(req, res) {
    try {
      const report = await db.userauth.find().toArray()
      var Excel = require('exceljs');
      var workbook = new Excel.Workbook();
      const url = await workbook.xlsx.readFile("./templates/Users.xlsx")
        .then(async function () {
          var worksheet = workbook.getWorksheet(1);
          for (var i = 0; i < report.length; i++) {
            var row = await worksheet.getRow(Number(9) + Number(i));
            row.getCell(1).value = report[i].username;
            row.getCell(2).value = report[i].email;
            row.getCell(3).value = report[i].role;
          }
          row.commit();
          const path = `download/Users${Date.now()}.xlsx`
          await workbook.xlsx.writeFile(`${path}`);
          const base64file = fs.readFileSync(path, { encoding: 'base64' })
          const contentType = "data:@file/octet-stream;base64,"
          const url = await `${process.env.SERVER_ORIGIN}/${path}`
          return { url: `http://localhost:1000/${path}`, filepath: path, urlnew: `${path}`, filepath: path }
        })
      res.send(url.urlnew)
      setTimeout(async () => { await removeFile(`${url.filepath}`) }, 2000)


    } catch (err) {
      res.status(500)
    }
  }
}

module.exports = service;