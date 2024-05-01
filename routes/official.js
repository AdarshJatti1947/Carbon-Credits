const express = require("express");
const middlewares = require("../middlewares/middlewareOfficial");
const helper = require("../functionalities/officialHelper");
const auth = require("../authenticate/official_auth");

const router = new express.Router();

router.post("/signup",middlewares.signup_param_validator,async (req,res) => { //JSON only API
  try
  {
    const responseObj = await helper.signup_official(req.body);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);

  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})


router.post("/login", middlewares.login_param_validator,async (req,res) =>{ //JSON only API
  try 
  {
    const responseObj = await helper.login_official(req.body);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.cookie("token",responseObj.token,{httpOnly: true});
    res.send(responseObj);

  } catch (err) 
  {
      const stat = err.status || 404
      const message = {status: stat,data:{message: err.message}};
      res.send(message)
  }
})

router.get("/auth",async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.auth_official(req);
    if(responseObj.status == 200)
    {
      res.redirect("/dashboard");
    }
    else if(responseObj.status == 201)
    {
      res.render("login_official");
    }
    else
    {
      throw new Error("Sorry some error was faced")
    }
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message) // res.sendFile("default error page");
  }
})

router.get("/dashboard",auth.authenticate_official,async (req,res) =>{ //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.dashboard_official(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.render("dashboard_official",{name: responseObj.data.name});
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.get("/auditPage",auth.authenticate_official, async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    res.render("verify_audit_official");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.post("/getAudits",auth.authenticate_official,async(req,res) =>{
  try
  {
    const responseObj = await helper.get_Audits(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
    
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})


router.post("/approveAudit", auth.authenticate_official,middlewares.approve_audit_param_validator,async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.approve_audit(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.post("/rejectAudit", auth.authenticate_official,middlewares.reject_audit_param_validator ,async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.reject_audit(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }

})


router.get("/projectsPage",auth.authenticate_official, async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    res.render("verify_proposal_official");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})


router.post("/getProject",auth.authenticate_official,async(req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.get_Projects(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
    
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.post("/approveProject",auth.authenticate_official,middlewares.approve_project_param_validator,async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.initiate_approve_request(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }

})


router.post("/finalizeApporval",auth.authenticate_official,middlewares.approve_project_param_validator,async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.verify_approve_request(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.post("/rejectProposal",auth.authenticate_official,middlewares.reject_project_param_validator,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.reject_project(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.send(responseObj);
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})


router.post("/logout",auth.authenticate_official, async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.logout_official(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.clearCookie("token");
    res.send(responseObj);
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

module.exports = router;