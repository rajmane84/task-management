import { Router } from "express";
import {
  handleForgotPassword,
  handleResetPassword,
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

authRouter.post("/forgot-password", validateUser, handleForgotPassword);

authRouter.post("/reset-password", validateUser, handleResetPassword);

export default authRouter;
