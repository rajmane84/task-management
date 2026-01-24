import { Router } from "express";
import {
  handleUserLogin,
  handleUserSignup,
  refreshAccessToken,
} from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", handleUserLogin);

authRouter.post("/register", handleUserSignup);

authRouter.get("/refresh-token", refreshAccessToken);

export default authRouter;
