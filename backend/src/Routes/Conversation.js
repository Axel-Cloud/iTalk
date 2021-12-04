import { Router } from "express";
import Conversations from "../Database/Controllers/Conversation";

const ConversationRouter = Router();

ConversationRouter.get("/", (Request, Response) => {
                        Conversations.Recieve(Request, Response);
                   })
                   .get("/Search", (Request, Response) => {
                        Conversations.SearchConversations(Request, Response);
                   })
                   .put("/", (Request, Response) => {
                         Conversations.MessagesReaded(Request, Response);
                   });

module.exports = ConversationRouter;