import { createBoardApi } from "@/helpers/board.helper";
import { handleApiError } from "@/helpers/handle-error";
import { CreateBoardPayload } from "@/types/board.type";

interface CreateBoardUIHandlers {
  setTitle: (title: string) => void;
  setBackground: (color: string) => void;
  setIsModalOpen: (val: boolean) => void;
}

export async function handleCreateBoard(
  payload: CreateBoardPayload,
  uiHandlers: CreateBoardUIHandlers,
) {
  const { title, background } = payload;
  const { setIsModalOpen, setBackground, setTitle } = uiHandlers;

  if (!title.trim()) return;

  try {
    const createdBoard = await createBoardApi({ title, background });
    console.log("Board created successfully:", createdBoard);
  } catch (error: any) {
    handleApiError(error);
  } finally {
    // Reset UI state
    setTitle("");
    setBackground("bg-blue-500");
    setIsModalOpen(false);
  }
}
