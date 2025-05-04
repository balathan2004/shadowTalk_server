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
exports.yoga = void 0;
const graphql_yoga_1 = require("graphql-yoga");
const schema_1 = require("@graphql-tools/schema");
const schema_2 = require("./models/schema");
const typeDefs = `
type Query {
  hello: String
  userLists( myId: ID! ): [User]
  getChatAndUserCred(myId: ID!,receiverId:ID!):ChatAndUserCred
  getChatList(myId: ID!): InboxResponse!
  getUser(myId:ID!):User
}
  type User {
    _id: ID!
    displayName: String!
    photoUrl: String!
    email: String!
    username:String!
    createdAt:Float!
  }

  type Message{
    _id: String!
    msgId: String!
    senderId: String!
    receiverId: String!
    content: String!
    createdAt: Float!
  }

  type MessageDoc{
   _id: String!
  createdAt: Float!
  members: [String]!
  messages:[Message]!
  }

  type InboxResponse{
  contacts:[User]!
  }


  type ChatAndUserCred{
  receiverId:User!
  messageData:MessageDoc
  }
`;
const resolvers = {
    Query: {
        hello: () => {
            return "hello world";
        },
        userLists: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const myId = args.myId;
            const data = (yield schema_2.UserModel.find({
                _id: { $ne: myId },
            }));
            return data;
        }),
        getChatAndUserCred: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { myId, receiverId } = args;
            const receiverDoc = (yield schema_2.UserModel.findById(receiverId));
            const chatId = [myId, receiverId].sort().join("@");
            const chatDoc = (yield schema_2.ChatModel.findById(chatId));
            console.log({
                receiverId: receiverDoc,
                messageData: chatDoc ? chatDoc.messages : [],
            });
            return {
                receiverId: receiverDoc,
                messageData: chatDoc ? chatDoc : null,
            };
        }),
        getChatList: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { myId } = args;
            const docs = (yield schema_2.ChatModel.find({
                _id: { $regex: myId },
            }));
            const ids = [
                ...new Set(docs.flatMap((doc) => doc.members.filter((id) => id !== myId))),
            ];
            const allUsers = (yield schema_2.UserModel.find({
                _id: { $in: ids },
            }));
            return { contacts: allUsers };
        }),
        getUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(args);
            const _id = args.myId;
            const user = (yield schema_2.UserModel.findOne({ _id: _id }));
            return user;
        }),
    },
};
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
exports.yoga = (0, graphql_yoga_1.createYoga)({ schema });
