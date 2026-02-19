import { Router } from "express";
import { validateUser } from "../../middlewares/auth.middleware";
import {
  handleCreateShareableLink,
  handleGetLinkByToken,
  handleUseLink,
  handleDeleteLink,
  handleGetLinksByTarget,
  handleRevokeLink,
} from "../../controllers/link.controller";

const linkRouter = Router();

linkRouter.get("/:token", handleGetLinkByToken);
linkRouter.post("/:token/use", handleUseLink);

linkRouter.use(validateUser);

linkRouter.post("/", handleCreateShareableLink);
linkRouter.patch("/:id/revoke", handleRevokeLink);
linkRouter.get("/target/:targetId", handleGetLinksByTarget);
linkRouter.delete("/:id", handleDeleteLink);


export default linkRouter;
