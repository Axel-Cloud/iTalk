import {Schema, model} from "mongoose";

const ConversationModel = new Schema({
    _id: { type: String },
    Conversation: [{
        UserID: {type: String, unique: false},
        Message: { type: String, unique: false },
        Date: { type: Date, unique: false }
    }]
});

module.exports = new model("Conversation", ConversationModel);