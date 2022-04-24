const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const mongoose = require("mongoose");
const User = require("../../models/User");

//@desc         get user conversation
//@route        GET /api/conversations
//@access       PRIVATE
const getUserConversation = catchAsync(async (req, res, next) => {
  console.log("Req user: ", req.user.id);
  const conversations = await Conversation.find({
    members: req.user._id,
  })
    .populate("members")
    .lean();
  res.status(200).json({
    message: "get user conversation successfully",
    data: conversations,
  });
});

//@desc         create new conversation with message
//@route        POST /api/conversations/:id
//@access       PRIVATE
const getConversationDetails = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate("messages")
    .populate("relatedPost")
    .lean();
  res.status(200).json({
    message: "get conversation details successfully",
    data: conversation,
  });
});

//@desc         create user conversation
//@route        POST /api/conversations
//@access       PRIVATE
const createNewConversationWithMessage = catchAsync(async (req, res, next) => {
  const { receiverId, text, postId } = req.body;
  const receiver = await User.findById(receiverId).lean();

  if (!receiver) {
    return next(new AppError("Receiver not found", 404));
  }
  const conversationInDB = await Conversation.findOne({
    members: { $all: [receiverId, req.user.id] },
  }).lean();

  if (conversationInDB) {
    return next(
      new AppError("Conversation with this user already exists", 400)
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const converId = new mongoose.Types.ObjectId();
  const message = {
    text,
    conversation: converId,
    sender: req.user.id,
  };
  const createdMessage = await Message.create([message], { session: session });
  let conversation = await Conversation.create(
    [
      {
        _id: converId,
        members: [req.user.id, receiverId],
        conversation: converId,
        latestMessage: createdMessage,
        relatedPost: postId,
      },
    ],
    {
      session: session,
    }
  );

  await session.commitTransaction();
  session.endSession();

  conversation = await Conversation.populate(conversation, {
    path: "messages relatedPost",
  });

  res.status(200).json({
    message: "create conversation successfully!",
    data: conversation,
  });
});

//@desc         create new message
//@route        GET /api/conversations/:conversationId/messages
//@access       PRIVATE
const createMessage = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  const { conversationId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  const conversation = await Conversation.findById(conversationId).session(
    session
  );
  if (!conversation) {
    return next(new AppError("Conversation not found", 404));
  }

  const newMessage = {
    text,
    sender: req.user.id,
    conversation: conversationId,
  };
  const message = await Message.create([newMessage], { session: session });
  conversation.latestMessage = message;
  await conversation.save();

  await session.commitTransaction();
  session.endSession();
  res.status(200).json({
    message: "create new message successfully!",
    data: message,
  });
});

module.exports = {
  getUserConversation,
  getConversationDetails,
  createNewConversationWithMessage,
  createMessage,
};
