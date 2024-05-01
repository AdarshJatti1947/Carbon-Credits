const mongoose = require("mongoose");

require("dotenv").config();

const DBUrl = process.env.mongo_url;

mongoose.connect(DBUrl).then(() =>{
  console.log("mongo connected successfully");
}).catch((e) =>{
  console.log(e.message);
})