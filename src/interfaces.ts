export interface userDataInterface {
  _id: string;
  displayName: string;
  email: string;
  photoUrl: string;
  createdAt: number;
  username:string
}

export interface ResponseConfig {
  message: string;
  status: 200 | 300;
}

export interface AuthResponseConfig extends ResponseConfig {
  userCred: userDataInterface | null;
}
export interface ChatSchemaInterface {
  _id: string;
  createdAt: Number;
  members: string[];
  messages: {
    _id: string; // Unique chat ID
    msgId: string; // unique msg id
    senderId: string; // ID of the user sending the message
    receiverId: string; // ID of the user receiving the message
    content: string; // Text content of the message
    createdAt: Number; // Timestamp of when the message was created
  }[];
}

export interface ChatMessageInterface {
  readonly _id: string; // Unique chat ID
  readonly msgId: string; // unique msg id
  readonly senderId: string; // ID of the user sending the message
  readonly receiverId: string; // ID of the user receiving the message
  readonly content: string; // Text content of the message
  readonly createdAt: number; // Timestamp of when the message was created
}