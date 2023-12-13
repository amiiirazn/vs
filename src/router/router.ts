import express from "express";
import { userRoter } from "./userRouter";
const Router = express.Router();
Router.use("/user",userRoter);
export { Router };
