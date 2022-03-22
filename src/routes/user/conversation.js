const express = require("express");

const router = express.Router();
const conversationController = require("../../controllers/user/conversationController");
const { protect } = require("../../middlewares/auth");

router.use(protect);
router
  .route("/")
  .get(conversationController.getUserConversation)
  .post(conversationController.createNewConversationWithMessage);
router.route("/:id").get(conversationController.getConversationDetails);
router.post("/:conversationId/messages", conversationController.createMessage);

module.exports = router;
