// if(process.env.NODE_ENV != "production") {
//     require('dotenv').config();
// }

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("connected");
})
.catch((err) => {
    console.log(err);
});

// const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : "678de45aed74369c5ebdf9a4" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();