import { Router } from "express";
import {
  handleUserLogin,
  handleUserLogout,
  handleUserSignup,
  refreshAccessToken,
} from "../../controllers/auth.controller";
import { validateUser } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", handleUserLogin);

authRouter.post("/register", handleUserSignup);

authRouter.get("/refresh-token", refreshAccessToken);

authRouter.get("/logout", validateUser, handleUserLogout);

export default authRouter;
