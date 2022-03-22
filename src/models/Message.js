const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    text: String,
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  {
    timestamps: true,
  }
);
MessageSchema.post("find", function (result) {
  console.log("find() returned " + JSON.stringify(result));
});
module.exports = mongoose.model("Message", MessageSchema);
