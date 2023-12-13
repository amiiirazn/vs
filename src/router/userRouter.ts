import express from "express";
import {
  change_password,
  dell,
  login,
  logout,
  singup,
} from "../controller/user";
import { checklogin } from "../middleware/checklogin";
const userRoter = express.Router();
userRoter.post("/singup", singup);
userRoter.post("/login", login);
userRoter.post("/logout", checklogin, logout);
userRoter.post("/dellacc", checklogin, dell);
userRoter.post("/changepassword",checklogin, change_password,);

export { userRoter };
