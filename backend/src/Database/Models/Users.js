import { Schema, model } from "mongoose";

const UsersModel = new Schema({
    Name: { type: String, unique: false, require: true },
    Lastname: { type: String, unique: false, require: true },
    Email: { type: String, index: {unique: true}, require: true },
    Password: { type: String, unique: false, require: true },
    Gender: { type: String, unique: false, require: true },
    ProfileImage: { type: String, unique: false, require: false },
    Online: { type: Boolean, unique: false, require },
    Conversations: [String]
});

module.exports = model("Users", UsersModel);