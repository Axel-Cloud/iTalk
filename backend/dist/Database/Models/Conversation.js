"use strict";

var _mongoose = require("mongoose");

const ConversationModel = new _mongoose.Schema({
  _id: {
    type: String
  },
  Users: [],
  Conversation: [{
    UserID: {
      type: String
    },
    Message: {
      type: String
    },
    Date: {
      type: Date
    },
    Readed: {
      type: Boolean
    }
  }]
});
module.exports = new _mongoose.model("Conversation", ConversationModel);
//# sourceMappingURL=Conversation.js.map