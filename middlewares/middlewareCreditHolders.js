const param_validator = require("../requestValidator/parameters");
const mailchecker = require("mailchecker");

function signup_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("name",true,false,"string");
    validator.validate("password",true,false,"string");
    validator.validate("email",true,false,"string");
    validator.validate("organisation",true,false,"string");
    validator.validate("publicKeyAddress",true,false,"string");

    if(req.body.password.length < 8)
    {
      throw new Error("password length not sufficient");
    }
    if(!mailchecker.isValid(req.body.email))
    {
      throw new Error("Invalid email");
    }
    next();

  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
}

function login_param_validator(req, res, next)
{
  try{
    const validator = new param_validator(req.body);

    validator.validate('email',true,false,'string');
    validator.validate('password',true,false,'string');

    if(req.body.password.length < 8)
    {
      throw new Error("password length not sufficient");
    }
    if(!mailchecker.isValid(req.body.email))
    {
      throw new Error("Invalid email");
    }
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }

}

function proposal_form_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("projectName",true,false,"string");
    validator.validate("organisation",true,false,"string");
    validator.validate("projectDescrption",true,false,"string");
    validator.validate("projectSector",true,false,"string");
    validator.validate("projectLocation",true,false,"string");
    validator.validate("projectWebsiteURL",true,false,"string");
    validator.validate("pricePerCredit",true,false,"number");

    next();

  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }

}

function confirm_approval_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);
    
    validator.validate("purchaseId",true,false,"string");

    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}


function transfer_process_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);
    
    validator.validate("projectId",true,false,"string");

    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}
module.exports = {signup_param_validator,login_param_validator,proposal_form_param_validator,confirm_approval_param_validator,transfer_process_param_validator};