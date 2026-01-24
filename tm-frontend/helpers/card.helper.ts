import axiosInstance from "@/lib/axios-instance";

interface ApiResponse<T> {
    data: T
}

interface Card {
    title: string;
    description?: string;
    completed: boolean;
    startDate?: Date | null;
    dueDate?: Date | null;
    assignedTo?: string;
    labels: string[]
    board: string
}

export async function createCardApi(data: any) {
  const response = await axiosInstance.post("/card/create", data);
  return response.data.data;
}

export async function getAllCardsAPi(boardId: string): Promise<Card[]> {
    const response = await axiosInstance.get<ApiResponse<Card[]>>(`/card/all/${boardId}`);
    return response.data.data;
}