import { createBoardApi, getBoardDetailsApi, toggleFavoriteApi } from "@/helpers/board.helper";
import { handleApiError } from "@/helpers/handle-error";
import { Background, CreateBoardPayload } from "@/types/board.type";

export async function handleCreateBoard(inputData: CreateBoardPayload): Promise<string | null> {
  try {
    const data = await createBoardApi(inputData);
    return data.message;
  } catch (error: unknown) {
    handleApiError(error);
    return null;
  }
}

export async function handleGetBoardDetails(boardId: string) {
  try {
    const data = await getBoardDetailsApi(boardId);
    return data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
}

export async function handleToggleFavorite(boardId: string) {
  try {
    const data = await toggleFavoriteApi(boardId);
    return data.message;
  } catch (error) {
    handleApiError(error);
    return null;
  }
}