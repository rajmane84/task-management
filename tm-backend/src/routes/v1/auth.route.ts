import { Router } from "express";
import {
  handleUserLogin,
  handleUserSignup,
} from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", handleUserLogin);

authRouter.post("/register", handleUserSignup);

export default authRouter;
