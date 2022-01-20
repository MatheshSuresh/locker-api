const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URL);
module.exports ={
    db:null,
    userauth:null,
    lockerData:null,

    async connect(){
        await client.connect();

        this.db = client.db(process.env.MONGODB_NAME);
        console.log("Database Selected")

        this.userauth=this.db.collection("userauth");
        this.lockerData=this.db.collection("lockerData");

    }
}