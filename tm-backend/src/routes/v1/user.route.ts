import { Router } from "express";
import {
  handleDeleteUser,
  handleGetCurrentUser,
  handleUpdateAvatar,
  handleUpdateUserDetails,
} from "../../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", handleGetCurrentUser);

userRouter.patch("/", handleUpdateUserDetails);

userRouter.patch("/avatar", handleUpdateAvatar);

userRouter.delete("/", handleDeleteUser);

export default userRouter;
