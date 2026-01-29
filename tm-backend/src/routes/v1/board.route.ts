import { Router } from "express";
import {
  handleCreateBoard,
  handleGetBoards,
  handleDeleteBoard,
  handleToggleFavorite,
  handleSearchBoards,
  handleGetFavoriteBoards,
  handleChangeVisibility,
  handleUpdateBoard,
  addMemberToBoard,
  removeMemberFromBoard,
  handleGetBoardDetails,
  handleUpdateRole
} from "../../controllers/board.controller";
import { validateUser } from "../../middlewares/auth.middleware";

const boardRouter = Router();

boardRouter.use(validateUser);

boardRouter.post("/create", handleCreateBoard);
boardRouter.get("/all", handleGetBoards);
boardRouter.get("/search", handleSearchBoards);
boardRouter.get("/favorites", handleGetFavoriteBoards);

boardRouter.get("/toggle/:id", handleToggleFavorite);
boardRouter.patch("/:id/visibility", handleChangeVisibility);
boardRouter.patch("/:id", handleUpdateBoard);

boardRouter.post("/:id/member", addMemberToBoard);
boardRouter.delete("/:id/member/:userId", removeMemberFromBoard);
boardRouter.patch("/:id/member/:userId", handleUpdateRole);

boardRouter.get("/:id", handleGetBoardDetails);

boardRouter.delete("/delete/:id", handleDeleteBoard);


export default boardRouter;
