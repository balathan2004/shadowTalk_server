"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSocketId = exports.getAllusers = exports.users = exports.io = void 0;
const http_1 = require("http");
const db_1 = __importDefault(require("./db"));
const express_1 = __importDefault(require("express"));
const rest_1 = require("./rest");
const graphql_1 = require("./graphql");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.143.57:5173",
    "http://127.0.0.1:5173",
    "http://192.168.133.57:5173",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
(0, db_1.default)();
app.use("/graphql", graphql_1.yoga);
//app.use("/api", apiroute);
app.use("/api", rest_1.apiroute);
const server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(server, {
    // ["http://localhost:5173","http://192.168.133.57:5173/"]
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
exports.users = {};
const getAllusers = () => {
    return exports.users;
};
exports.getAllusers = getAllusers;
const getUserSocketId = (userId) => {
    return exports.users[userId]; // Return socket ID if user is online
};
exports.getUserSocketId = getUserSocketId;
app.get("/", (_, res) => {
    res.send("Server is running");
});
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        exports.users[userId] = socket.id; // Store mapping
    }
    socket.on("disconnect", () => {
        delete exports.users[userId];
    });
});
server.listen(port, () => {
    console.log("GraphQL server running on http://localhost:4000/graphql");
});
