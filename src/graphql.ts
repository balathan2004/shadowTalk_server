import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ChatModel, UserModel } from "./models/schema";
import { ChatSchemaInterface, userDataInterface } from "./interfaces";

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
    userLists: async (_: any, args: { myId: string }) => {
      const myId = args.myId;
      const data = (await UserModel.find({
        _id: { $ne: myId },
      })) as userDataInterface[];
      return data;
    },
    getChatAndUserCred: async (
      _: any,
      args: { myId: string; receiverId: string }
    ) => {
      const { myId, receiverId } = args;
      const receiverDoc = (await UserModel.findById(
        receiverId
      )) as userDataInterface;
      const chatId = [myId, receiverId].sort().join("@");
      const chatDoc = (await ChatModel.findById(chatId)) as ChatSchemaInterface;

      console.log({
        receiverId: receiverDoc,
        messageData: chatDoc ? chatDoc.messages : [],
      });
      return {
        receiverId: receiverDoc,
        messageData: chatDoc ? chatDoc : null,
      };
    },
    getChatList: async (_: any, args: { myId: string }) => {
      const { myId } = args;
      const docs = (await ChatModel.find({
        _id: { $regex: myId },
      })) as ChatSchemaInterface[];
      const ids = [
        ...new Set(
          docs.flatMap((doc) => doc.members.filter((id) => id !== myId))
        ),
      ];
      const allUsers = (await UserModel.find({
        _id: { $in: ids },
      })) as userDataInterface[];
      return { contacts: allUsers };
    },
    getUser: async (_: any, args: { myId: string }) => {
      console.log(args);
      const _id = args.myId;

      const user = (await UserModel.findOne({ _id: _id })) as userDataInterface;

      return user;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
export const yoga = createYoga({ schema });
