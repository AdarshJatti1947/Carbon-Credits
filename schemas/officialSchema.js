const mongoose = require("mongoose");

const officialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  publicKeyAddress: {
    type: String,
    required:true,
    unique: true
  },
  currentToken:
  {
    type: String
  }, 
})

const official = mongoose.model("official",officialSchema);

module.exports = official;