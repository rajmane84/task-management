import { Router } from "express";
import {
  handleCreateCard,
  handleDeleteCard,
  handleGetCards,
  handleUpdateCard,
} from "../../controllers/card.controller";
import { validateUser } from "../../middlewares/auth.middleware";

const cardRouter = Router();

cardRouter.get("/all/:boardId", validateUser, handleGetCards);
cardRouter.post("/create", validateUser, handleCreateCard);
cardRouter.delete("/delete/:cardId", validateUser, handleDeleteCard);
cardRouter.put("/update/:cardId", validateUser, handleUpdateCard);

export default cardRouter;
