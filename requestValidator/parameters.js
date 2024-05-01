class request
{
  reqBody;
  constructor(reqBody)
  {
    this.reqBody = reqBody;
  }
  validate(param_name,ispresent,isblank,param_type)
  {
    this.check_presence(ispresent,param_name);
    this.check_blank(isblank,param_name);
    this.check_type(param_type,param_name);
  }
  check_presence(ispresent,param_name)
  {
    if(ispresent)
    {
        if(!this.reqBody[param_name])
        {
          throw new Error(`${param_name} is not present`);
        }
    }
  }
  check_blank(isblank,param_name)
    {
      if(!isblank)
      {
        if(this.reqBody[param_name] == "")
        {
          throw new Error(`${param_name} field is blank`);
        }
      }
    }

    check_type(param_type,param_name)
    {
      if(param_type === "[object Date]")
      {
        if(new Date(this.reqBody[param_name]) == "Invalid Date" && isNaN(new Date(this.reqBody[param_name])))
        {
          throw new Error(`${param_name} is supposed to be a date`);
        }
      }
      else
      {
        if(typeof(this.reqBody[param_name]) !== param_type)
        {
          throw new Error(`${param_name} is supposed to be a ${param_type}`);
        }
    }
    }
}

module.exports = request;