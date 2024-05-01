const express = require("express");
const middlewares = require("../middlewares/middlewareCreditHolders");
const helper = require("../functionalities/creditHolderHelper");
const auth = require("../authenticate/creditHolder_auth");
const mod = require("../middlewares/modifyNumberParams");

const router = new express.Router();

router.post("/signup",middlewares.signup_param_validator,async (req,res) => { //JSON only API
  try
  {
    const responseObj = await helper.signup_creditHolder(req.body);
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

router.get("/register", async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    res.render("signup_creditHolder");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message) //// res.sendFile("default error page");
  }
 
})

router.get("/auth",async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.auth_creditHolder(req);
    if(responseObj.status == 200)
    {
      res.redirect("http://localhost:3000/creditHolder/dashboard");
    }
    else if(responseObj.status == 201)
    {
      res.render("login_creditHolder");
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

router.post("/login", middlewares.login_param_validator,async (req,res) =>{ //JSON only API
  try 
  {
    const responseObj = await helper.login_creditHolder(req.body);
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

router.get("/dashboard",auth.authenticate_creditHolder,async (req,res) =>{ //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.dashboard_creditHolder(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.render("dashboard_creditHolder",{name: responseObj.data.name});
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})


router.post("/proposal",auth.authenticate_creditHolder, mod.modify,middlewares.proposal_form_param_validator,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.proposal_submission(req);
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

});

router.get("/orders",auth.authenticate_creditHolder, async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    res.render("approve_creditHolder");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.post("/orders",auth.authenticate_creditHolder,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.get_pruchaseRequests(req);
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

router.post("/confirm-purchase",auth.authenticate_creditHolder,middlewares.confirm_approval_param_validator,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.confirm_purchase_request(req);
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

router.post("/finalize-approval",auth.authenticate_creditHolder,middlewares.confirm_approval_param_validator,async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.verify_purchase_request(req);
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

router.get("/transfers",auth.authenticate_creditHolder,async (req,res) =>{ //needs default error page (this API only serves pages,directly or through redirects)

  try
  {
    res.render("transfer_creditHolder");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }

})

router.post("/approvedProjects",auth.authenticate_creditHolder, async(req,res) =>{
  try
  {
    const responseObj = await helper.get_projects(req);
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

router.post("/confirmTransfer",auth.authenticate_creditHolder,middlewares.transfer_process_param_validator,async (req,res) =>{
  try
  {
    const responseObj = await helper.initiate_token_transfer(req);
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


router.post("/finaliseTransfer",auth.authenticate_creditHolder,middlewares.transfer_process_param_validator,async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.verify_token_transfer(req);
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

router.post("/logout",auth.authenticate_creditHolder, async (req,res) =>{//JSON only API
  try
  {
    const responseObj = await helper.logout_creditHolder(req);
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