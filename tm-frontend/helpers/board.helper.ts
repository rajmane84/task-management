import axiosInstance from "@/lib/axios-instance";
import { CreateBoardPayload } from "@/types/board.type";

interface ApiResponse<T> {
  data: T;
}

export interface IBoard {
  _id: string;
  title: string;
  background: string;
  createdBy: string;
  favorite: boolean;
  cards: string[];
}

export async function createBoardApi({
  title,
  background,
}: CreateBoardPayload) {
  const response = await axiosInstance.post("/board/create", {
    title,
    background,
  });
  return response;
}

export async function getAllBoardsApi(token?: string) :Promise<IBoard[]> {
  const response = await axiosInstance.get<ApiResponse<IBoard[]>>("/board/all", {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: cookieStore.toString(),
    },
  });

  return response.data.data
}

export async function toggleFavoriteApi(boardId: string): Promise<IBoard> {
  const response = await axiosInstance.get<ApiResponse<IBoard>>(`/board/toggle/${boardId}`);
  return response.data.data
}
