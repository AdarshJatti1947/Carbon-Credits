const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const port = 3000;

app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set ("view engine", "ejs"); 
app.use(express.static("public"));

require("./mongodb/mongo");

const creditHolderRoutes = require("./routes/creditholder");
const officialRoutes = require("./routes/official");
const customerRoutes = require("./routes/customer");

app.use("/creditHolder",creditHolderRoutes);
app.use("/official",officialRoutes);
app.use("/customer",customerRoutes);

app.get("/",async (req,res) => {
  try
  {
    res.render("landing_page");
  }
  catch(err)
  {
    const message = {status: 400,data: "Some error has occured, please refresh or try again later"}
    res.status(400).send(message);
  }

});


app.listen(port ,()=> {
  console.log(`Server started at port ${port}`);
})