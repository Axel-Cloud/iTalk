"use strict";

var _express = require("express");

var _Conversation = _interopRequireDefault(require("../Database/Controllers/Conversation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ConversationRouter = (0, _express.Router)();
ConversationRouter.get("/", (Request, Response) => {
  _Conversation.default.Recieve(Request, Response);
}).get("/Search", (Request, Response) => {
  _Conversation.default.SearchConversations(Request, Response);
}).put("/", (Request, Response) => {
  _Conversation.default.MessagesReaded(Request, Response);
});
module.exports = ConversationRouter;
//# sourceMappingURL=Conversation.js.map