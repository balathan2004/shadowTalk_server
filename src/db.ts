import mongoose from "mongoose";

const cloudUrl =
  "mongodb+srv://balathan2004:shadowTalk9719@shadowtalk.irhupcl.mongodb.net/shadowTalk?retryWrites=true&w=majority&appName=shadowTalk";

const localUrl = "mongodb://localhost:27017/shadowTalk";
const connectDB = async () => {
  try {
    await mongoose.connect(cloudUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
