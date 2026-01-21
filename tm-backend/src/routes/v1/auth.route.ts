import { Router } from "express";
import {
  handleUserLogin,
  handleUserSignup,
} from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", handleUserLogin);

authRouter.post("/register", handleUserSignup);

authRouter.get("/refresh-token", (req, res) => {
  // generate access token using refresh token
})

export default authRouter;
