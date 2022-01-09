const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//Get a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
})

//Update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === post.userId) {
      await Post.updateOne({
        $set: req.body
      });
      return res.status(200).json("The post has been successfully been updated");
    } else {
      return res.status(403).json("You have no rights to update this post");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})

//Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === post.userId) {
      await Post.deleteOne();
      return res.status(200).json("The post has been successfully been Deleted");
    } else {
      return res.status(403).json("You have no rights to Delete this post");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})

//Like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId
        }
      });
      return res.status(200).json("Post liked successfully!");
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId
        }
      });
      return res.status(200).json("Post unliked successfully!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})

//Get timeline post
router.get("/", async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err); 
  }
})

//Get timeline post
router.get("/timeline", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPost = await Post.find({userId: currentUser._id});
   
    //Get a post of all friends followed by Current User
    const friendsPost = await Promise.all(
     currentUser.followings.map((friendId)=>{
      return Post.find({userId: friendId});
     })
    );
    res.json(userPost.concat(...friendsPost));
  } catch (err) {
    res.status(500).json(err); 
  }
})

module.exports = router;