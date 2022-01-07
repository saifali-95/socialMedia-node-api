const router = require("express").Router();
const Post = require("../models/Post");

//Get a post

router.post("/", async (req, res)=> {
  const newPost = new Post(req.body);
  try { 
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } 
  catch(err) {  
    return res.status(500).json(err);
  }
})

//Update a post

//Delete a post

//Like a post

//Get a post

//Get timeline post


module.exports = router;