import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: String,
    displayName: String,
    email: String,
    photoUrl: String,
    createdAt: Number,
    username: String,
  },
  { _id: false }
);

const UserModel = mongoose.model("User", userSchema);



const ChatSchema = new mongoose.Schema(
  {
    _id: String,
    createdAt: Number,
    members: [String],
    messages: [
      {
        _id: String, // Unique chat ID
        msgId: String, // unique msg id
        senderId: String, // ID of the user sending the message
        receiverId: String, // ID of the user receiving the message
        content: String, // Text content of the message
        createdAt: Number, // Timestamp of when the message was created
      },
    ],
  },
  { _id: false }
);

const ChatModel = mongoose.model("messages", ChatSchema);

export { UserModel, ChatModel };
