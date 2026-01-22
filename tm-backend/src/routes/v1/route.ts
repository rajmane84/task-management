import { Router, type Request, type Response } from "express";
import authRouter from "./auth.route";
import boardRouter from "./board.route";

const V1Router = Router();

V1Router.use("/auth", authRouter);
V1Router.use("/board", boardRouter);
V1Router.use("/health", (req: Request, res: Response) => {
  return res.status(200).json({ message: "API is healthy", status: "OK" });
});

export default V1Router;
