const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
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
  creditRequirement:
  {
    type: Number,
    default: 0,
  },
  latestAudit:
  {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  currentToken:
  {
    type: String
  }
})

const customer = mongoose.model("customer",customerSchema);

module.exports = customer;