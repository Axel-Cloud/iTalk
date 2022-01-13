"use strict";

var _express = require("express");

var _Users = _interopRequireDefault(require("../Database/Controllers/Users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UsersRouter = (0, _express.Router)();
/*
    Route "/":
    1. Get: Login, Information
    2. Post: Create User
    3. Put: Update User Data
    4. posDelete: Delete User
*/

UsersRouter.get("/", (Request, Response) => {
  _Users.default.Login(Request.query, Response);
}).get("/Data", (Request, Response) => {
  _Users.default.UserData(Request.query, Response);
}).get("/Search", (Request, Response) => {
  _Users.default.Search(Request.query, Response);
}).post("/", (Request, Response) => {
  _Users.default.Create(Request.body, Response);
}).post("/Forgot", (Request, Response) => {
  _Users.default.ForgotPass(Request, Response);
}).put("/Reset", (Request, Response) => {
  _Users.default.ResetPass(Request.body, Response);
}).put("/Reset/Cancel", (Request, Response) => {
  _Users.default.CancelResetPass(Request.body, Response);
})
/* PI = Profile Image */
.put("/UpdatePI", (Request, Response) => {
  _Users.default.UpdateProfileImage(Request.body, Response);
}).put("/UpdateUserInfo", (Request, Response) => {
  _Users.default.UpdateUserInfo(Request.body, Response);
});
module.exports = UsersRouter;
//# sourceMappingURL=Users.js.map