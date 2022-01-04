const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
  console.log('MongoDB Server Connected');
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res)=>{
  res.send("Welcome to homepage");
});

app.get("/users", (req, res)=>{
  res.send("Welcome to users page");
});

app.listen(8800, ()=>{
  console.log("Backend Server Running")
});



