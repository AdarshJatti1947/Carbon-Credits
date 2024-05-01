const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  dateOfCreation: {
    type: Date,
    required: true
  },
  ElectricityConsumption: {
    type: Number,
    required: true,
  },
  DocumentsElectricityConsumption: {
    type: String,
    required: true
  },
  NaturalGasConsumption: {
    type: Number,
    required: true
  },
  DocumentsNaturalGasConsumption: {
    type: String,
    required: true
  },
  OilBarrelConsumption: {
    type: Number,
    required: true
  },
  DocumentsOilBarrelConsumption: {
    type: String,
    required: true
  },
  PetrolConsumption: {
    type: Number,
    required: true
  },
  DocumentsPetrolConsumption: {
    type: String,
    required: true
  },
  DieselConsumption: {
    type: Number,
    required: true
  },
  DocumentsDieselConsumption: {
    type: String,
    required: true
  },
  officialId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
  },
  totalConsumption:{
    type: Number,
    required: true
  },
  checkStatus:{
    type: Boolean,
    required: true,
    default: true
  },
  approvalStatus:{
    type: Boolean,
    required: true,
    default: false
  },
  resonForRejection: {
    type: String
  }
})

const audit = mongoose.model("audit",auditSchema);

module.exports = audit;