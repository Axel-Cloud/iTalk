import { Router } from "express";
import Conversations from "../Database/Controllers/Conversation";

const ConversationRouter = Router();

ConversationRouter.get("/", (Request, Response) => {
    Conversations.Recieve(Request, Response);
});

module.exports = ConversationRouter;