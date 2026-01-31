import axiosInstance, { MyAxiosInstance } from "@/lib/axios-instance";
import { Background, CreateBoardPayload } from "@/types/board.type";

export interface IBoard {
  _id: string;
  title: string;
  background: Background;
  createdBy: string;
  favorite: boolean;
  cards: string[];
}

export async function createBoardApi({
  title,
  background,
}: CreateBoardPayload) {
  const {data} = await axiosInstance.post<MyAxiosInstance>("/board/create", {
    title,
    background,
  });
  return data;
}

export async function toggleFavoriteApi(boardId: string) {
  const {data} = await axiosInstance.get<MyAxiosInstance<IBoard>>(`/board/toggle/${boardId}`);
  return data;
}

export async function getBoardDetailsApi(boardId: string){
  const response = await axiosInstance.get(`/board/${boardId}`);
  return response.data.data;
}