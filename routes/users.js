const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res)=> {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    if(req.body.password){
      try{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      catch {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      })
      return res.status(200).json("Your update has been made");
    }
    catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only update your account");
  }
});

//delete user
router.delete("/:id", async (req, res)=> {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.body.userId);
      return res.status(200).json("Your account has been deleted");
    }
    catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});

//get a user
router.get("/:id", async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, updatedAt, ...other} = user._doc;
    return res.status(200).json(other);
  }
  catch (err) {
    return res.status(500).json(err);
  }
})

//follow a user
router.put("/:id/follow", async(req, res) => {

  if(req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      //Validate if the current user is already following that specific user
      if(!user.followers.includes(req.body.userId)) {
        await user.updateOne({$push: {followers: req.body.userId}});
        await currentUser.updateOne({$push: {followings: req.params.id}});
        return res.status(200).json("Successfully followed this user");
      }
      else {
        return res.status(403).json("You are already following this user");
      }
    }
    catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You cannot follow yourself");
  }
})


//unfollow a user
router.put("/:id/unfollow", async(req, res) => {

  if(req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      //Validate if the current user is already following that specific user
      if(user.followers.includes(req.body.userId)) {
        await user.updateOne({$pull: {followers: req.body.userId}});
        await currentUser.updateOne({$pull: {followings: req.params.id}});
        return res.status(200).json("Successfully unfollowed this user");
      }
      else {
        return res.status(403).json("You have already unfollowed this user");
      }
    }
    catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You cannot unfollow yourself");
  }
})

module.exports = router;