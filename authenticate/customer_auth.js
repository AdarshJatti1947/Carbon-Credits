const customer = require("../schemas/customerSchema");

async function authenticate_customer (req,res,next)
{
  try
  {
    if(!req.cookies.token || req.cookies.token == "")
    {
      throw new Error("User not logged in");
    }
    const token = req.cookies.token;
    const User = await customer.findOne({currentToken: token});
    if(!User)
    {
      throw new Error("Invalid or expired token");
    }
    next();
  }
  catch(err)
  {
    const status = err.status||404;
    res.clearCookie("token");
    res.redirect("http://localhost:3000/");
  }
}

module.exports = {authenticate_customer};