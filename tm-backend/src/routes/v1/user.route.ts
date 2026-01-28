import { Router } from "express";
import {
  handleCheckUsernameExists,
  handleDeleteUser,
  handleGetCurrentUser,
  handleUpdateAvatar,
  handleUpdateUserDetails,
} from "../../controllers/user.controller";
import { upload } from "../../middlewares/multer";
import { validateUser } from "../../middlewares/auth.middleware";

const userRouter = Router();

userRouter.use(validateUser);

userRouter.get("/", handleGetCurrentUser);

userRouter.post("/check-username", handleCheckUsernameExists);

userRouter.patch("/", handleUpdateUserDetails);

userRouter.patch("/avatar", upload.single("avatar"), handleUpdateAvatar);

userRouter.delete("/me", handleDeleteUser);

export default userRouter;
