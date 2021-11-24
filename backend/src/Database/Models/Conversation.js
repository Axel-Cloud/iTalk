import {Schema, model} from "mongoose";

const ConversationModel = new Schema({
    _id: { type: String },
    Conversation: [{
        UserID: {type: String },
        Message: { type: String },
        Date: { type: Date },
        Readed: { type: Boolean }
    }]
});

module.exports = new model("Conversation", ConversationModel);