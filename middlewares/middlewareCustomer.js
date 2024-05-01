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
    res.send(message);
  }

}

function audit_form_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("from",true,false,"[object Date]");
    validator.validate("to",true,false,"[object Date]");
    
    validator.validate("ElectricityConsumtion",true,false,"number");
    validator.validate("NaturalGasConsumption",true,false,"number");
    validator.validate("OilBarrelConsumption",true,false,"number");
    validator.validate("PetrolConsumption",true,false,"number");
    validator.validate("DieselConsumption",true,false,"number");

    validator.validate("DocumentsElectricityConsumption",true,false,"string");
    validator.validate("DocumentsNaturalGasConsumption",true,false,"string");
    validator.validate("DocumentsOilBarrelConsumption",true,false,"string");
    validator.validate("DocumentsPetrolConsumption",true,false,"string");
    validator.validate("DocumentsDieselConsumption",true,false,"string");
    next();

  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }

}

function search_creditHolder_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("prompt",true,false,"string");
    next();

  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }

}

function buy_credits_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("projectId",true,false,"string");
    validator.validate("amount",true,false,"number");
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}

function buy_credits_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("projectId",true,false,"string");
    validator.validate("amount",true,false,"number");
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}

function verify_payments_param_validator(req,res,next)
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




module.exports = {signup_param_validator,login_param_validator,audit_form_param_validator,search_creditHolder_param_validator
  ,buy_credits_param_validator,verify_payments_param_validator,transfer_process_param_validator};