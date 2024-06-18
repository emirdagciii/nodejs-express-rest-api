const express = require("express");
const { getPosts, createPosts, getDetail, getUpdate, deletePost,saerchPost } = require("../controllers/post.js");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.get("/getPosts",getPosts)
router.post("/createPosts",auth,createPosts)
router.get("/getDetail/:id",getDetail)
router.patch("/getUpdate/:id",auth,getUpdate)
router.delete("/deletePost/:id",auth,deletePost)
router.delete("/saerchPost/:id",saerchPost)


module.exports = router