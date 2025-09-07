const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect =()=>{
    mongoose.connect(process.env.DATABASE_URL)
        .then(()=>{
        console.log("connected to databse successfully 🟢")})
        .catch((e)=>{
            console.log("Failed to connect to database  🔴 ")
            console.log(e);
            process.exit(1);
        })
};

module.exports = dbconnect;