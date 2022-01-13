import { Router } from "express";
import Users from "../Database/Controllers/Users";

const UsersRouter = Router();

/*
    Route "/":
    1. Get: Login, Information
    2. Post: Create User
    3. Put: Update User Data
    4. posDelete: Delete User
*/

UsersRouter.get("/", (Request, Response) => {
                Users.Login(Request.query, Response);
            })
            .get("/Data", (Request, Response) => {
                Users.UserData(Request.query, Response);
            })
            .get("/Search", (Request, Response) => {
                Users.Search(Request.query, Response);
            })
            .post("/", (Request, Response) => {
                Users.Create(Request.body, Response);
            })
            .post("/Forgot", (Request, Response) => {
                Users.ForgotPass(Request, Response);
            })
            .put("/Reset", (Request, Response) => {
                Users.ResetPass(Request.body, Response);
            })
            .put("/Reset/Cancel", (Request, Response) => {
                Users.CancelResetPass(Request.body, Response);
            })
            /* PI = Profile Image */
            .put("/UpdatePI", (Request, Response) => {
                Users.UpdateProfileImage(Request.body, Response);
            })
            .put("/UpdateUserInfo", (Request, Response) => {
                Users.UpdateUserInfo(Request.body, Response);
            });

module.exports = UsersRouter;