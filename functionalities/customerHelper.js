const customer = require("../schemas/customerSchema");
const audit = require("../schemas/auditSchema");
const official = require("../schemas/officialSchema");
const project = require("../schemas/projectSchema");
const purchase = require("../schemas/purchaseSchema");
const creditHolder = require("../schemas/creditHolderSchema");
const calculate = require("../heavy/calculate")
const transform = require("../heavy/tranformer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signup_customer(req)
{
  try{
    const Customer = req.body;
    const password = await bcrypt.hash(req.body.password,8);
    Customer.password = password;

    const newCustomer = new customer(Customer);
    await newCustomer.save();

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

async function auth_customer(req)
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


async function login_customer(req)
{
  try
  {
    const Customer = await customer.findOne({email: req.body.email});
    let token;
    if(!Customer)
    {
      throw new Error("Invalid login request");
    }
    const valid = await bcrypt.compare(req.body.password,Customer.password);
    if(!valid)
    {
      throw new Error("Invalid login request");
    }
    else
    {
      token = jwt.sign({id:Customer.id},process.env.key);
      Customer.currentToken = token;
      await Customer.save();
    }
    const responseObj = {status: 200,data:{message: "Login Successful",user:Customer.name,token:token}};
    return responseObj;

  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function dashboard_customer(req)
{
  try
  {
    const Customer = await customer.findOne({currentToken: req.cookies.token});
    const responseObj = {status: 200,data: {message:"User fetched" ,name: Customer.name}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function audit_submission(req)
{
  try
  {
    const Customer = await customer.findOne({currentToken: req.cookies.token});
    if(Customer.latestAudit != null)
    {
      throw new Error("You've already created an Audit")
    }

    const beginDate = new Date(req.body.from);
    const endDate = new Date(req.body.to);
    let diff = (endDate.getTime() - beginDate.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    diff = Math.round(diff / 365.25);
    if(diff != 1)
    {
      throw new Error("Audit period should be exactly an year")
    }
    
    const count = await official.count();
    const random = Math.floor(Math.random() * count);
    const Official = await official.findOne().skip(random);

    let Audit = req.body;
    Audit.customerId = Customer.id;
    Audit.officialId = Official.id;

    const dateOfCreation = new Date();
    if(dateOfCreation.getTime() < endDate.getTime())
    {
      throw new Error("Audit dates should be in the past")
    }

    Audit.dateOfCreation = dateOfCreation;

    const consumption = await calculate.calculate_emissions(req);
    Audit.totalConsumption = consumption;
    
    const newAudit = new audit(Audit);
    await newAudit.save();

    Customer.latestAudit = newAudit.id;
    await Customer.save();

    const responseObj = {status:200,data:{message:"Audit creadted"}};
    return responseObj;

  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function search_creditHolders(req)
{
  try
  {
    const results = await transform.fetch(req.body.prompt);
    if(Object.keys(results).length === 0)
    {
      throw new Error("We couldn't find any matching results");
    }
    const keys = Object.keys(results);
    let projects = [];
    for(let i=0;i<keys.length;i++)
    {
      let id = results[keys[i]];
      const Project = await project.findOne({_id:id})
      let json_obj = {};
      json_obj.id = results[keys[i]];
      json_obj.name = Project.projectName;
      json_obj.description = Project.projectDescrption;
      json_obj.organisation = Project.organisation;
      json_obj.creditsAvailable = Project.creditsAvailable;
      json_obj.pricePerCredit = Project.pricePerCredit;
      json_obj.webSiteUrl = Project.projectWebsiteURL;
      projects.push(json_obj);
    }
    if(projects.length === 0)
    {
      throw new Error("Some issue has occured");
    }
    const responseObj = {status:200,data:{message:"successful",projects:projects}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function buy_credits(req)
{
  try
  {
    const Project = await project.findOne({_id:req.body.projectId});
    const Customer = await customer.findOne({currentToken: req.cookies.token});
    
    if(!Project)
    {
      throw new Error("Please Enter valid project ID");
    }
    if(Project.creditsAvailable < req.body.amount)
    {
      throw new Error("The amount of credits requested is not available with this project");
    }
    if(Customer.creditRequirement === 0)
    {
      throw new Error("You have to submit an audit and wait for its verification before buying credits")
    }
    if(Customer.creditRequirement < req.body.amount)
    {
      throw new Error("You are purchasing more credits than you require");
    }


    let Purchase ={};
    Purchase.creditHolderId = Project.ownerId;
    Purchase.customerId = Customer.id;
    Purchase.projectId = Project.id;
    Purchase.amount = req.body.amount*Project.pricePerCredit;
    Purchase.dateOfCreation = new Date()

    const newPurchase = new purchase(Purchase);
    await newPurchase.save();

    const CreditHolder = await creditHolder.findOne({_id:Project.ownerId})
    const paymentInfo = {id: newPurchase.id,pkaddress: CreditHolder.publicKeyAddress,amount: newPurchase.amount};

    const responseObj = {status:200,data:{message:"successful",paymentInfo:paymentInfo}};
    return responseObj;

  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function verify_payment(req)
{
  try
  {
    const Purchase = await purchase.findOne({_id:req.body.purchaseId});
    const Customer = await customer.findOne({_id:Purchase.customerId});
    if(!Purchase || Purchase.approvalStatus == true)
    {
      throw new Error("Some error has occured");
    }
    
    Purchase.checkStatus = true;
    await Purchase.save();

    Customer.creditRequirement = Customer.creditRequirement - Purchase.amount;
    if(Customer.creditRequirement === 0)
    {
      Customer.latestAudit = null;
    }
    await Customer.save();

    const Project = await project.findOne({_id:Purchase.projectId});
    Project.creditsAvailable = Project.creditsAvailable-Purchase.amount;
    await Project.save();

    const responseObj = {status: 200,data: {message:"Payment Successful"}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function transfer_from(req)
{
  try
  {
    const Customer = await customer.findOne({currentToken:req.cookies.token});
    const Purchases = await purchase.find({customerId: Customer.id, approvalStatus: true, tranferFromStatus: false});
    if(Purchases.length === 0)
    {
      throw new Error("There are no current purchase requests that have been approved");
    }

    let requests = [];
    for(let i=0;i<Purchases.length;i++)
    {
      const CreditHolder = await creditHolder.findOne({_id:Purchases[i].creditHolderId});
      const Project = await project.findOne({_id:Purchases[i].projectId});
      const Official = await official.findOne({_id:Project.officialId});
      let individualRequest = {};
      individualRequest.id = Purchases[i].id;
      individualRequest.amount = Purchases[i].amount;
      individualRequest.projectId = Purchases[i].projectId;
      individualRequest.projectName = Project.projectName;
      individualRequest.sellerPKA = CreditHolder.publicKeyAddress;
      individualRequest.officialEmail = Official.email;
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


async function initiate_token_transfer(req)
{
  try
  {
    const Purchase = await purchase.findOne({_id:req.body.purchaseId});
    const CreditHolder = await creditHolder.findOne({_id:Purchase.creditHolderId});
    const Customer = await customer.findOne({currentToken:req.cookies.token});
    if(!Purchase)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Purchase.approvalStatus !== true)
    {
      throw new Error("This Purchase request has not been approved yet");
    }
    if(Purchase.tranferFromStatus === true)
    {
      throw new Error("The tokens associated with this purchase have already been transferred");
    }

    const transferDetails = {id:req.body.purchaseId,pkSaddress:CreditHolder.publicKeyAddress,pkRaddress: Customer.publicKeyAddress,amount:Purchase.amount};

    const responseObj = {status:200,data:{message:"Token transfer request given",transferDetails:transferDetails}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}


async function verify_token_transfer(req)
{
  try
  {
    const Purchase = await purchase.findOne({_id:req.body.purchaseId});
    if(!Purchase)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Purchase.tranferFromStatus === true)
    {
      throw new Error("This Purchase request has already been completed");
    }

    Purchase.tranferFromStatus = true;
    await Purchase.save();

    const responseObj = {status:200,data:{message:"Token transfer completed"}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function logout_customer(req)
{
  try
  {
    const Customer = await customer.findOne({currentToken: req.cookies.token});
    Customer.currentToken = "";
    await Customer.save();

    const responseObj = {status: 200,data:{message: "Logout Successful",user:Customer.name}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

module.exports = {signup_customer,login_customer,logout_customer,auth_customer,dashboard_customer,
  audit_submission,search_creditHolders,buy_credits,verify_payment,transfer_from,initiate_token_transfer,verify_token_transfer}


