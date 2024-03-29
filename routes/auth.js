const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register new user
router.post("/register", async (req, res) => {
  try {
    //create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //save new user and respond
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    //create new user
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json("user not found");
    }

    //validate hashed password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("password is incorrect");
    }

    //respond 200 succesful if password and username are correct
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
