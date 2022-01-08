const router = require("express").Router();
const Post = require("../models/Post");

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

//Get a post

//Get timeline post


module.exports = router;