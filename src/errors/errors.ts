import type { ErrorRequestHandler } from "express";
const notFound: ErrorRequestHandler = (error, req, res, next) => {
  res.status(404).json({ message: "notfound" });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = error.status || 500;
  console.log(error);
  const message =
    error.error.message || error.error.errors || "internal server error";
  res.status(status).json({ status, message, success: false });
};
export { errorHandler, notFound };
