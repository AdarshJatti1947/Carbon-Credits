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
    res.status(stat).send(message)
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
    res.status(stat).send(message)
  }

}

function approve_audit_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("auditId",true,false,"string");
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}


function reject_audit_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("auditId",true,false,"string");
    validator.validate("reasonWhy",true,false,"string");
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}


function approve_project_param_validator(req,res,next)
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


function reject_project_param_validator(req,res,next)
{
  try
  {
    const validator = new param_validator(req.body);

    validator.validate("projectId",true,false,"string");
    validator.validate("reasonWhy",true,false,"string");
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message);
  }
}

module.exports = {signup_param_validator,login_param_validator,approve_audit_param_validator,
  reject_audit_param_validator,approve_project_param_validator,reject_project_param_validator};