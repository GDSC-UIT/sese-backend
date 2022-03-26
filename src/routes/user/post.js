const express = require("express");

const router = express.Router();
const postController = require("../../controllers/user/postController");
const { protect } = require("../../middlewares/auth");

router.use(protect);
router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);
router
  .route("/:id")
  .get(postController.getPostDetails)
  .put(postController.updatePost);

module.exports = router;
