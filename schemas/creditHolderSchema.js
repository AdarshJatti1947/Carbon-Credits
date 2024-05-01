const mongoose = require("mongoose");

const creditHolderSchema = new mongoose.Schema({
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
  organisation:
  {
    type: String,
    required: true
  },
  currentToken:
  {
    type: String
  },
})

const creditHolder = mongoose.model("creditHolder",creditHolderSchema);

module.exports = creditHolder;