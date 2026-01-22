import { Router } from "express";
import { handleCreateBoard, handleGetBoards, handleDeleteBoard } from "../../controllers/board.controller";
import { validateUser } from "../../middlewares/auth.middleware";

const boardRouter = Router();

boardRouter.post("/create", validateUser, handleCreateBoard);
boardRouter.get("/all", validateUser, handleGetBoards);
boardRouter.delete("/delete/:id", handleDeleteBoard);

export default boardRouter;