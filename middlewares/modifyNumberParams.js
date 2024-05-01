function modify(req,res,next)
{
  try
  {
    const body = req.body;
    for (var index in body) 
    {
      if (!isNaN(body[index])) {
        body[index] = Number(body[index]);
      }
     
    }
    req.body = body;
    next();
  }
  catch(err)
  {
    const stat = err.status || 404;
    const message = {status: stat,data:{message: err.message}};
    res.send(message)
  }
}

module.exports = {modify};