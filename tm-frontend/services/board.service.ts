import { createBoardApi, getBoardDetailsApi } from "@/helpers/board.helper";
import { handleApiError } from "@/helpers/handle-error";
import { Background, CreateBoardPayload } from "@/types/board.type";

export async function handleCreateBoard(data: CreateBoardPayload) {
  try {
    const response = await createBoardApi(data);
    return response.data;
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