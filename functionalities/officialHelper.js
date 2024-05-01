const official = require("../schemas/officialSchema");
const audit = require("../schemas/auditSchema");
const customer = require("../schemas/customerSchema");
const project = require("../schemas/projectSchema");
const creditHolder = require("../schemas/creditHolderSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signup_official(req)
{
  try{
    const Official = req;
    const password = await bcrypt.hash(req.password,8);
    Official.password = password;

    const newOfficial = new official(Official);
    await newOfficial.save();

    const responseObj = {status: 200,data:{message: "user created"}};
    return responseObj;
    }
    catch(err)
    {
      const status = err.status || 404;
      const responseObj = {status: status,data:{message: err.message}};
      return responseObj;
    }
}


async function login_official(req)
{
  try
  {
    const Official = await official.findOne({email: req.email});
    let token;
    if(!Official)
    {
      throw new Error("Invalid login request");
    }
    const valid = await bcrypt.compare(req.password,Official.password);
    if(!valid)
    {
      throw new Error("Invalid login request");
    }
    else
    {
      token = jwt.sign({id:Official.id},process.env.key);
      Official.currentToken = token;
      await Official.save();
    }
    const responseObj = {status: 200,token:token,data:{message: "Login Successful",user:Official.name}};
    return responseObj;

  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function auth_official(req)
{
  try
  {
    let status = 200;
    message = "User is logged in";
    if(!req.cookies.token)
    {
      status = 201;
      message = "User needs to login"
    }
    const responseObj = {status: status, data:{message:message}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
    
  }
}

async function dashboard_official(req)
{
  try
  {
    const Official = await official.findOne({currentToken: req.cookies.token});
    const responseObj = {status: 200,data: {message:"User fetched" ,name: Official.name}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}


async function get_Audits(req)
{
  try
  {
    const Official = await official.findOne({currentToken: req.cookies.token});
    const AuditRequests = await audit.find({officialId:Official.id,checkStatus: true});
    if(!AuditRequests || AuditRequests.length === 0)
    {
      throw new Error("No pending audit verifications");
    }

    let requests = [];
    for(let i=0;i<AuditRequests.length;i++)
    {
      let individualRequest = {};
      individualRequest.id = AuditRequests[i].id;
      individualRequest.ElectricityConsumption = AuditRequests[i].ElectricityConsumption;
      individualRequest.DocumentsElectricityConsumption = AuditRequests[i].DocumentsElectricityConsumption;
      individualRequest.NaturalGasConsumption = AuditRequests[i].NaturalGasConsumption;
      individualRequest.DocumentsNaturalGasConsumption = AuditRequests[i].DocumentsNaturalGasConsumption;
      individualRequest.OilBarrelConsumption = AuditRequests[i].OilBarrelConsumption;
      individualRequest.DocumentsOilBarrelConsumption = AuditRequests[i].DocumentsOilBarrelConsumption;
      individualRequest.PetrolConsumption = AuditRequests[i].PetrolConsumption;
      individualRequest.DocumentsPetrolConsumption = AuditRequests[i].DocumentsPetrolConsumption;
      individualRequest.DieselConsumption = AuditRequests[i].DieselConsumption;
      individualRequest.DocumentsDieselConsumption = AuditRequests[i].DocumentsDieselConsumption;
      individualRequest.from = AuditRequests[i].from;
      individualRequest.to = AuditRequests[i].to;
      individualRequest.totalConsumption = AuditRequests[i].totalConsumption;
      requests.push(individualRequest);
    }

    if(requests.length === 0)
    {
      throw new Error("Some issue has occured");
    }

    const responseObj = {status:200, data:{message:"successful",requests:requests}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function approve_audit(req)
{
  try
  {
    const Audit = await audit.findOne({_id:req.body.auditId})
    if(!Audit)
    {
      throw new Error("Please enter a valid audit Id");
    }

    const Customer = await customer.findOne({_id:Audit.customerId});

    if(process.env.carbon_emission_limit < Audit.totalConsumption)
    {
      const requirement = Math.round(Audit.totalConsumption - process.env.carbon_emission_limit);
      Customer.creditRequirement = requirement;
      await Customer.save();
    }
    

    Audit.approvalStatus = true;
    Audit.checkStatus = false;
    await Audit.save();

    const responseObj = {status: 200,data:{message:"Audit approved successfully"}};
    return responseObj;
    
    
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function reject_audit(req)
{
  try
  {
    const Audit = await audit.findOne({_id:req.body.auditId})
    if(!Audit)
    {
      throw new Error("Please enter a valid audit Id");
    }

    Audit.resonForRejection = req.body.reasonWhy;
    Audit.approvalStatus = false;
    Audit.checkStatus = false;
    await Audit.save();

    const responseObj = {status: 200,data:{message:"Audit rejected "}};
    return responseObj;
    
    
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}


async function get_Projects(req)
{
  try
  {
    const Official = await official.findOne({currentToken: req.cookies.token});
    const ProjectRequests = await project.find({officialId:Official.id,checkStatus: true});
    if(!ProjectRequests || ProjectRequests.length === 0)
    {
      throw new Error("No pending audit verifications");
    }

    let requests = [];
    for(let i=0;i<ProjectRequests.length;i++)
    {
      let individualRequest = {};
      individualRequest.id = ProjectRequests[i].id;
      individualRequest.projectName = ProjectRequests[i].projectName;
      individualRequest.organisation = ProjectRequests[i].organisation;
      individualRequest.projectDescrption = ProjectRequests[i].projectDescrption;
      individualRequest.projectWebsiteURL = ProjectRequests[i].projectWebsiteURL;
      individualRequest.pricePerCredit= ProjectRequests[i].pricePerCredit;
      requests.push(individualRequest);
    }

    if(requests.length === 0)
    {
      throw new Error("Some issue has occured");
    }

    const responseObj = {status:200, data:{message:"successful",requests:requests}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function initiate_approve_request(req)
{
  try
  {
    const Project = await project.findOne({_id:req.body.projectId});
    if(!Project)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }

    const CreditHolder = await creditHolder.findOne({_id:Project.ownerId});
  
    if(Project.checkStatus === false || Project.approvalStatus === true)
    {
      throw new Error("This Project has already been checked");
    }

    const transferDetails = {id:req.body.projectId,pkaddress:CreditHolder.publicKeyAddress,amount:30};

    const responseObj = {status:200,data:{message:"Token transfer approval given",transferDetails:transferDetails}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function verify_approve_request(req)
{
  try
  {
    const Project = await project.findOne({_id:req.body.projectId});
    if(!Project)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Project.checkStatus === false || Project.approvalStatus === true)
    {
      throw new Error("This Purchase request has already been approved");
    }

    Project.checkStatus = false;
    Project.approvalStatus = true;
    Project.creditsAvailable = 30;
    await Project.save();

    const responseObj = {status:200,data:{message:"Token transfer approval verified"}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}



async function reject_project(req)
{
  try
  {
    const Project = await project.findOne({_id:req.body.projectId})
    if(!Project)
    {
      throw new Error("Please enter a valid audit Id");
    }

    Project.resonForRejection = req.body.reasonWhy;
    Project.approvalStatus = false;
    Project.checkStatus = false;
    await Project.save();

    const responseObj = {status: 200,data:{message:"Project rejected "}};
    return responseObj;
    
    
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function logout_official(req)
{
  try
  {
    const Official = await official.findOne({currentToken: req.cookies.token});
    Official.currentToken = "";
    await Official.save();

    const responseObj = {status: 200,data:{message: "Logout Successful",user:Official.name}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

module.exports = {signup_official,login_official,logout_official,auth_official,
  dashboard_official,get_Audits,approve_audit,reject_audit,get_Projects,initiate_approve_request,verify_approve_request,reject_project};