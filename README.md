

# ShadowTalk Server

The backend for ShadowTalk — a real-time chat platform focused on secure, fast, and efficient messaging.

## Tech Stack

- TypeScript  
- Node.js  
- Express  
- MongoDB (Mongoose)  
- GraphQL (Apollo Server)  
- REST API  
- Socket.IO  


## Features

- Dual API Support – Combines both GraphQL and REST for flexibility.  
- Real-Time Messaging – Instant message delivery using WebSockets.  
- Secure User Auth – Token-based authentication with Firebase Admin.  
- Message Storage – Chat history stored and retrieved from MongoDB.  
- Socket Events – Emits and listens for message-related events live.

## How It Works

1. Users authenticate via Firebase tokens.  
2. Messages are sent via REST or sockets and stored in MongoDB.  
3. Clients use GraphQL to fetch user and chat data efficiently.  
4. All events are emitted in real-time using Socket.IO.

## About

**Dev:** Light  
**LinkedIn:** [Link to LinkedIn]  

This server powers ShadowTalk’s real-time experience, combining modern APIs with a robust messaging pipeline.

## License

This project is licensed under the MIT License.

