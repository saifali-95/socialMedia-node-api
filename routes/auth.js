const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res)=> {
  
  try {
    //create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User ({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })
    //save new user and respond
    const user = await newUser.save();
    res.status(200).json(user)
  } catch {
    console.log(err);
  }
});

module.exports = router;