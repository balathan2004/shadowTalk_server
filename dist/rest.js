"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiroute = void 0;
const express_1 = require("express");
const schema_1 = require("./models/schema");
const server_1 = require("./server");
const { generateUsername } = require("unique-username-generator");
const apiroute = (0, express_1.Router)();
exports.apiroute = apiroute;
apiroute.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, displayName, email, photoUrl, createdAt } = req.body;
    const existingUser = yield schema_1.UserModel.findById(_id);
    console.log("logged", req.body);
    if (!existingUser) {
        const username = generateUsername("", 2, 19);
        const data = yield schema_1.UserModel.create({
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
            userCred: data.toJSON(),
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
        userCred: existingUser.toJSON(),
    });
}));
apiroute.get("/loginCred", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("requested");
    const _id = req.cookies.shadowTalkUid;
    console.log(_id, "is id");
    const userDoc = yield schema_1.UserModel.findById(_id);
    if (!userDoc) {
        res.json({ status: 300, message: "account not found", userCred: null });
        return;
    }
    res.json({
        status: 200,
        message: "credentials fetched",
        userCred: userDoc,
    });
}));
apiroute.post("/messages/store", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { msgData } = data;
    try {
        if (!isEmptyOrNull(data)) {
            const doc = yield schema_1.ChatModel.findOneAndUpdate({ _id: msgData._id }, {
                $setOnInsert: {
                    _id: msgData._id,
                    createdAt: msgData.createdAt,
                    members: [...msgData._id.split("@")],
                    //messages: [],
                },
                $push: { messages: msgData },
            }, { upsert: true, new: true });
            emitMessage(msgData.receiverId, data);
            res.json({ status: 200, message: "success" });
        }
    }
    catch (err) {
        console.log(err);
        res.json({ status: 300, message: "error" });
    }
}));
apiroute.get("/hello", (req, res) => {
    res.json({ message: "hello" });
});
apiroute.get("/add_location", (req, res) => {
    const { data } = req.body;
});
apiroute.get("/test", (req, res) => {
    res.json({ status: 200, message: "success" });
});
const isEmptyOrNull = (obj) => {
    return Object.values(obj).some((value) => value === null || value === undefined || value === "");
};
const emitMessage = (userId, messageData) => __awaiter(void 0, void 0, void 0, function* () {
    //const users=getAllusers()
    const socketId = (0, server_1.getUserSocketId)(userId);
    if (!socketId) {
        return;
    }
    server_1.io.to(socketId).emit("messageData", messageData);
});
