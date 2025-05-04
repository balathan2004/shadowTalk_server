import { Response, Request, Router } from "express";
import { ChatModel, UserModel } from "./models/schema";
import {  getUserSocketId, io } from "./server";
import {
  AuthResponseConfig,
  ChatMessageInterface,
  ResponseConfig,
  userDataInterface,
} from "./interfaces";
const { generateUsername } = require("unique-username-generator");
const apiroute = Router();

apiroute.post(
  "/auth",
  async (req: Request, res: Response<AuthResponseConfig>) => {
    const { _id, displayName, email, photoUrl, createdAt } =
      req.body as userDataInterface;
    const existingUser = await UserModel.findById(_id);
    console.log("logged", req.body);
    if (!existingUser) {
      const username = generateUsername("", 2, 19);
      const data = await UserModel.create({
        _id: _id,
        displayName,
        email,
        photoUrl,
        createdAt,
        username,
      });

      console.log(data, "data");

      res.cookie("shadowTalkUid", _id, {
        httpOnly: true,
        maxAge: 2592000000,
        secure: true, // Works without HTTPS
        sameSite: "none",
      });

      res.json({
        status: 200,
        message: "account created",
        userCred: data.toJSON() as userDataInterface,
      });
      return;
    }
    res.cookie("shadowTalkUid", _id, {
      httpOnly: true,
      maxAge: 2592000000,
      secure: true, // Works without HTTPS
      sameSite: "none",
    });

    res.json({
      status: 200,
      message: "logged in",
      userCred: existingUser.toJSON() as userDataInterface,
    });
  }
);

apiroute.get(
  "/loginCred",
  async (req: Request, res: Response<AuthResponseConfig>) => {
    console.log("requested");

    const _id = req.cookies.shadowTalkUid;
    console.log(_id, "is id");

    const userDoc = await UserModel.findById(_id);

    if (!userDoc) {
      res.json({ status: 300, message: "account not found", userCred: null });
      return;
    }
    res.json({
      status: 200,
      message: "credentials fetched",
      userCred: userDoc as userDataInterface,
    });
  }
);

type OutgoingMessagePayload = {
  msgData: ChatMessageInterface;
  senderInfo: {
    name: string;
    profileUrl: string;
  };
};

apiroute.post(
  "/messages/store",
  async (req: Request, res: Response<ResponseConfig>) => {
    const data = req.body as OutgoingMessagePayload;

    const { msgData } = data;

    try {
      if (!isEmptyOrNull(data)) {
        const doc = await ChatModel.findOneAndUpdate(
          { _id: msgData._id },
          {
            $setOnInsert: {
              _id: msgData._id,
              createdAt: msgData.createdAt,
              members: [...msgData._id.split("@")],
              //messages: [],
            },
            $push: { messages: msgData },
          },
          { upsert: true, new: true }
        );

        emitMessage(msgData.receiverId, data);

        res.json({ status: 200, message: "success" });
      }
    } catch (err) {
      console.log(err);
      res.json({ status: 300, message: "error" });
    }
  }
);

apiroute.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

apiroute.get("/add_location", (req: Request, res: Response) => {
  const { data } = req.body;
});

apiroute.get("/test", (req: Request, res: Response) => {
  res.json({ status: 200, message: "success" });
});

const isEmptyOrNull = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some(
    (value) => value === null || value === undefined || value === ""
  );
};

const emitMessage = async (
  userId: string,
  messageData: OutgoingMessagePayload
) => {
  //const users=getAllusers()
  const socketId = getUserSocketId(userId);
  if (!socketId) {
    return;
  }
  io.to(socketId).emit("messageData", messageData);
};

export {apiroute};




