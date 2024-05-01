const official = require("../schemas/officialSchema");

async function authenticate_official (req,res,next)
{
  try
  {
    if(!req.cookies.token || req.cookies.token == "")
    {
      throw new Error("User not logged in");
    }
    const token = req.cookies.token;
    const User = await official.findOne({currentToken: token});
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

module.exports = {authenticate_official};