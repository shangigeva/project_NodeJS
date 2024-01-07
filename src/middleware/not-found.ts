import { RequestHandler } from "express";
import path from "path";

// The last middleware in the chain:
const notFound: RequestHandler = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../../public/404Page.html"));
};

export { notFound };
