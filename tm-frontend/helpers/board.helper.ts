import axiosInstance from "@/lib/axios-instance";
import { CreateBoardPayload } from "@/types/board.type";

export async function createBoardApi({ title, background }: CreateBoardPayload) {
  const response = await axiosInstance.post("/board/create", { title, background });
  return response.data.data;
}
