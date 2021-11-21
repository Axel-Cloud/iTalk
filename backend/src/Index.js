import express from "express";
import Cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import "./Database/db";

require('dotenv').config();

const App = express();
const httpServer = createServer(App);
const SocketIO = new Server(httpServer, { cors: { origin: '*' } });

/* Server Settings */
process.setMaxListeners(0)
App.set("Port", process.env.Port || 3003);

/* Middlewares */
App.use(Cors());
App.use(express.json());

/* Server Routes */
App.use("/api/Users", require("./Routes/Users"));
App.use("/api/Conversation", require("./Routes/Conversation"));

//SocketIO
SocketIO.on("connection", (Socket) => {
    Socket.on("JoinConversation", (ConversationID) => {
        console.log(ConversationID);
    });

    Socket.on("Message", ({UserID, Message}) => {
        SocketIO.emit("Message", {UserID, Message});
    })
});

/* Server Listen */
httpServer.listen(App.get("Port"), () => {
    console.log(`Listen on port ${App.get("Port")}`);
});