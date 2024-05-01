const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  creditHolderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dateOfCreation: {
    type: Date,
    required: true
  },
  checkStatus:{
    type: Boolean,
    required: true,
    default: false
  },
  approvalStatus:{
    type: Boolean,
    required: true,
    default: false
  },
  tranferFromStatus:{
    type: Boolean,
    required: true,
    default: false
  }
})

const purchase = mongoose.model("purchase",purchaseSchema);

module.exports = purchase;