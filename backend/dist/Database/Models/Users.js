"use strict";

var _mongoose = require("mongoose");

const UsersModel = new _mongoose.Schema({
  Name: {
    type: String,
    unique: false,
    require: true
  },
  Lastname: {
    type: String,
    unique: false,
    require: true
  },
  Email: {
    type: String,
    index: {
      unique: true
    },
    require: true
  },
  Password: {
    type: String,
    unique: false,
    require: true
  },
  Gender: {
    type: String,
    unique: false,
    require: true
  },
  ProfileImage: {
    type: String,
    unique: false,
    require: false
  },
  Online: {
    type: Boolean,
    unique: false,
    require
  },
  Conversations: [String]
});
module.exports = (0, _mongoose.model)("Users", UsersModel);
//# sourceMappingURL=Users.js.map