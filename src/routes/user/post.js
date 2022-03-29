const express = require("express");

const router = express.Router();
const postController = require("../../controllers/user/postController");
const { protect } = require("../../middlewares/auth");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);
router
  .route("/:id")
  .get(postController.getPostDetails)
  .put(postController.updatePost);

module.exports = router;
