import { Schema, model } from "mongoose";

const UsersRecover = new Schema({
    UserID: String,
    RecoverDate: { type: Date, default: Date.now },
    Active: { type: Boolean, default: true } 
});

module.exports = model('UsersRecover', UsersRecover);