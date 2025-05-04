"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: String,
    displayName: String,
    email: String,
    photoUrl: String,
    createdAt: Number,
    username: String,
}, { _id: false });
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
const ChatSchema = new mongoose_1.default.Schema({
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
}, { _id: false });
const ChatModel = mongoose_1.default.model("messages", ChatSchema);
exports.ChatModel = ChatModel;
