const creditHolder = require("../schemas/creditHolderSchema");
const project = require("../schemas/projectSchema");
const official = require("../schemas/officialSchema");
const purchase = require("../schemas/purchaseSchema");
const customer = require("../schemas/customerSchema");
const transform = require("../heavy/tranformer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signup_creditHolder(req)
{
  try{
    const CreditHolder = req;
    const password = await bcrypt.hash(req.password,8);
    CreditHolder.password = password;

    const newCreditHolder = new creditHolder(CreditHolder);
    await newCreditHolder.save();

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

async function auth_creditHolder(req)
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

async function login_creditHolder(req)
{
  try
  {
    const CreditHolder = await creditHolder.findOne({email: req.email});
    let token;
    if(!CreditHolder)
    {
      throw new Error("Invalid login request");
    }
    const valid = await bcrypt.compare(req.password,CreditHolder.password);
    if(!valid)
    {
      throw new Error("Invalid login request");
    }
    else
    {
      token = jwt.sign({id:CreditHolder.id},process.env.key);
      CreditHolder.currentToken = token;
      await CreditHolder.save();
    }
    const responseObj = {status: 200,token:token,data:{message: "Login Successful",user:CreditHolder.name}};
    return responseObj;

  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function dashboard_creditHolder(req)
{
  try
  {
    const CreditHolder = await creditHolder.findOne({currentToken: req.cookies.token});
    const responseObj = {status: 200,data: {message:"User fetched" ,name: CreditHolder.name}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

async function proposal_submission(req)
{
  try
  {
    const CreditHolder = await creditHolder.findOne({currentToken: req.cookies.token});

    const count = await official.count();
    const random = Math.floor(Math.random() * count);
    const Official = await official.findOne().skip(random);

    let Project = req.body;
    Project.ownerId = CreditHolder.id;
    Project.officialId = Official.id;

    const newProject = new project(Project);
    await newProject.save();

    const responseObj = {status:200,data:{message:"Proposal creadted"}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}


async function get_pruchaseRequests(req)
{
  try
  {
    const CreditHolder = await creditHolder.findOne({currentToken: req.cookies.token});
    const PurchaseRequests = await purchase.find({creditHolderId:CreditHolder.id,checkStatus: true});
    if(!PurchaseRequests || PurchaseRequests.length === 0)
    {
      throw new Error("No pending orders");
    }

    let requests = [];
    for(let i=0;i<PurchaseRequests.length;i++)
    {
      const Customer = await customer.findOne({_id:PurchaseRequests[i].customerId});
      const Project = await project.findOne({_id:PurchaseRequests[i].projectId});
      const Official = await official.findOne({_id:Project.officialId});
      let individualRequest = {};
      individualRequest.id = PurchaseRequests[i].id;
      individualRequest.amount = PurchaseRequests[i].amount;
      individualRequest.projectId = PurchaseRequests[i].projectId;
      individualRequest.projectName = Project.projectName;
      individualRequest.customerPKA = Customer.publicKeyAddress;
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

async function confirm_purchase_request(req)
{
  try
  {
    const Purchase = await purchase.findOne({_id:req.body.purchaseId});
    if(!Purchase)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Purchase.checkStatus === false )
    {
      throw new Error("This Purchase request has already been checked");
    }

    const Customer = await customer.findOne({_id:Purchase.customerId});
    const transferDetails = {id:req.body.purchaseId,pkaddress:Customer.publicKeyAddress,amount:Purchase.amount};

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

async function verify_purchase_request(req)
{
  try
  {
    const Purchase = await purchase.findOne({_id:req.body.purchaseId});
    if(!Purchase)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Purchase.checkStatus === false || Purchase.approvalStatus === true)
    {
      throw new Error("This Purchase request has already been approved");
    }

    Purchase.checkStatus = false;
    Purchase.approvalStatus = true;
    await Purchase.save();

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


async function get_projects(req)
{
  try
  {
    const CreditHolder = await creditHolder.findOne({currentToken: req.cookies.token});
    const ProjectRequests = await project.find({ownerId:CreditHolder.id,checkStatus: false,tranferFromStatus: false});
    if(!ProjectRequests || ProjectRequests.length === 0)
    {
      throw new Error("No pending transfers");
    }

    let requests = [];
    for(let i=0;i<ProjectRequests.length;i++)
    {
      const Official = await official.findOne({_id:ProjectRequests[i].officialId});
      let individualRequest = {};
      individualRequest.id = ProjectRequests[i].id;
      individualRequest.name = ProjectRequests[i].projectName;
      individualRequest.credits = ProjectRequests[i].creditsAvailable;
      individualRequest.officialPKA = Official.publicKeyAddress;
      individualRequest.officialEmail = Official.email;
      individualRequest.status = ProjectRequests[i].approvalStatus;
      if(!individualRequest.status) individualRequest.reason = ProjectRequests[i].resonForRejection;
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
    const Project = await project.findOne({_id:req.body.projectId});
    const Official = await official.findOne({_id:Project.officialId});
    const CreditHolder = await creditHolder.findOne({currentToken:req.cookies.token});
    if(!Project)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Project.approvalStatus !== true)
    {
      throw new Error("This Project has not been approved yet");
    }
    if(Project.tranferFromStatus === true)
    {
      throw new Error("The tokens associated with this project have already been transferred");
    }

    const transferDetails = {id:req.body.projectId,pkSaddress:Official.publicKeyAddress,pkRaddress: CreditHolder.publicKeyAddress,amount:Project.creditsAvailable};

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
    const Project = await project.findOne({_id:req.body.projectId});
    if(!Project)
    {
      throw new Error("Pleas enter a valid Id from the List");
    }
    if(Project.tranferFromStatus === true)
    {
      throw new Error("This Purchase request has already been completed");
    }

    Project.tranferFromStatus = true;
    await Project.save();

    const results = await transform.train();
    if(!results)
    {
      throw new Error("Some issue occured")
    }

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

async function logout_creditHolder(req)
{
  try
  {
    const CreditHolder = await creditHolder.findOne({currentToken: req.cookies.token});
    CreditHolder.currentToken = "";
    await CreditHolder.save();

    const responseObj = {status: 200,data:{message: "Logout Successful",user:CreditHolder.name}};
    return responseObj;
  }
  catch(err)
  {
    const status = err.status || 404;
    const responseObj = {status: status,data:{message: err.message}};
    return responseObj;
  }
}

module.exports = {signup_creditHolder,login_creditHolder,logout_creditHolder,dashboard_creditHolder,auth_creditHolder,
  proposal_submission,get_pruchaseRequests,confirm_purchase_request,verify_purchase_request,get_projects,initiate_token_transfer,verify_token_transfer};