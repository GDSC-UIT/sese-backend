const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: { type: Object, required: true },
    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);

ConversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversation",
});

module.exports = mongoose.model("Conversation", ConversationSchema);
