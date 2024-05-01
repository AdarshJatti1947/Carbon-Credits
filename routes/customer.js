const express = require("express");
const middlewares = require("../middlewares/middlewareCustomer");
const helper = require("../functionalities/customerHelper");
const auth = require("../authenticate/customer_auth");
const mod = require("../middlewares/modifyNumberParams");

const router = new express.Router();

router.post("/signup",middlewares.signup_param_validator,async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.signup_customer(req);
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

router.get("/register", async (req,res) => {
  try
  {
    res.render("signup_customer");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.status(stat).send(message)
  }
 
})


router.get("/auth",async (req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.auth_customer(req);
    if(responseObj.status == 200)
    {
      res.redirect("http://localhost:3000/customer/dashboard");
    }
    else if(responseObj.status == 201)
    {
      res.render("login_customer");
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
    res.status(stat).send(message) // res.sendFile("default error page");
  }
})


router.post("/login", middlewares.login_param_validator,async (req,res) =>{ //JSON only api
  try 
  {
    const responseObj = await helper.login_customer(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.cookie("token",responseObj.data.token,{httpOnly: true});
    res.send(responseObj); //res.redirect("/dashboard");

  } catch (err) 
  {
      const stat = err.status || 404
      const message = {status: stat,data:{message: err.message}};
      res.send(message)
  }
})

router.get("/dashboard",auth.authenticate_customer,async (req,res) =>{ //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    const responseObj = await helper.dashboard_customer(req);
    if(responseObj.status !== 200)
    {
      throw new Error(responseObj.data.message);
    }
    res.render("dashboard_customer",{name: responseObj.data.name});
  }
  catch(err)
  {
      const stat = err.status || 404
      const message = {status: stat,data:{message: err.message}};
      res.send(message)
  }
})

router.post("/audit",auth.authenticate_customer,mod.modify,middlewares.audit_form_param_validator, async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.audit_submission(req);
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

router.get("/search",auth.authenticate_customer, async (req,res) =>{ //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    res.render("AI_search");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }

})

router.post("/view-projects",auth.authenticate_customer, middlewares.search_creditHolder_param_validator,async(req,res) =>{// JSON only API
  try
  {
    const responseObj = await helper.search_creditHolders(req);
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

router.post("/buyCredits",auth.authenticate_customer,mod.modify,middlewares.buy_credits_param_validator,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.buy_credits(req);
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

router.post("/verifyPayment",auth.authenticate_customer,middlewares.verify_payments_param_validator,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.verify_payment(req);
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


router.get("/tokens",auth.authenticate_customer,async(req,res) => { //needs default error page (this API only serves pages,directly or through redirects)
  try
  {
    res.render("transfer_customer");
  }
  catch(err)
  {
    const stat = err.status || 404
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
})

router.post("/transfers",auth.authenticate_customer,async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.transfer_from(req);
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

router.post("/confirmTransfer",auth.authenticate_customer,middlewares.transfer_process_param_validator,async (req,res) =>{//JSON only API
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


router.post("/finaliseTransfer",auth.authenticate_customer,middlewares.transfer_process_param_validator,async (req,res) =>{//JSON only API
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

router.post("/logout",auth.authenticate_customer, async (req,res) =>{ //JSON only API
  try
  {
    const responseObj = await helper.logout_customer(req);
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