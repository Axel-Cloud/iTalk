"use strict";

var _mongoose = require("mongoose");

const UsersRecover = new _mongoose.Schema({
  UserID: String,
  RecoverDate: {
    type: Date,
    default: Date.now
  },
  Active: {
    type: Boolean,
    default: true
  }
});
module.exports = (0, _mongoose.model)('UsersRecover', UsersRecover);
//# sourceMappingURL=UsersRecover.js.map