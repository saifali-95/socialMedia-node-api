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

app.listen(8800, ()=>{
  console.log("Backend Server Running")
});



