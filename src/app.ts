import exoress from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Router } from "./router/router";
import { errorHandler, notFound } from "./errors/errors";
const app = exoress();
mongoose.connect("mongodb://localhost:27017/back").then(() => {
  console.log("DB connecting...");
});
app.use(exoress.json());
app.use(exoress.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", Router);
app.use(errorHandler);
app.use(notFound);
app.listen(3000, () => console.log("serever is runing ..."));
