import express from "express";
import Cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import "./Database/db";

//Controllers
import Users from "./Database/Controllers/Users";
import Conversations from "./Database/Controllers/Conversation";

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
    Socket.on("SetUser", (UserID) => {
        Socket.join(UserID.UserID);
        Users.UpdateOnline({ID: UserID.UserID, Online: true});  
    });

    Socket.on("UnsetUser", (UserID) => {
        Socket.leave(UserID.UserID);
        Users.UpdateOnline({ID: UserID.UserID, Online: false});
    });

    Socket.on("Message", ({ConversationID, EmitterID, RecieverID, Message}) => {
        console.log("Entro");
        Conversations.NewMessage({ConversationID, EmitterID, RecieverID, Message}, SocketIO);
    });
});

/* Server Listen */
httpServer.listen(App.get("Port"), () => {
    console.log(`Listen on port ${App.get("Port")}`);
});