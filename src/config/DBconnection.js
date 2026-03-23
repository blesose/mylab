const mongoose = require("mongoose");

require('dotenv').config();

const dbConnectionString = process.env.DBSTRING;

const connectDB = async () => {
    // console.log("DB String:", process.env.DBSTRING);
    try {
        console.log("connecting to db ...")
        await mongoose.connect(dbConnectionString, )
        console.log("connection to db established 100% ✅")
    } catch (error) {
        console.log("Error connecting to db:", error);
    }
};

module.exports = connectDB;
