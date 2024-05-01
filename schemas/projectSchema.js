const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  ownerId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  projectName: {
    type: String,
    required: true
  },
  organisation:
  {
    type: String,
    required: true
  },
  projectDescrption:
  {
    type: String,
    required: true
  },
  projectSector:{
    type: String,
    required: true
  },
  projectLocation:{
    type: String,
    required: true
  },
  projectWebsiteURL:
  {
    type: String,
    required: true,
  },
  pricePerCredit: {
    type: Number,
    required: true
  },
  creditsAvailable:{
    type: Number,
    default:0
  },
  checkStatus:
  {
    type: Boolean,
    required: true,
    default: true
  },
  approvalStatus:
  {
    type: Boolean,
    required: true,
    default: false
  },
  tranferFromStatus:{
    type: Boolean,
    required: true,
    default: false
  },
  officialId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  resonForRejection: {
    type: String
  }
})

const project = mongoose.model("project",projectSchema);

module.exports = project;