import axiosInstance from "@/lib/axios-instance";

interface ApiResponse<T> {
  data: T;
}

interface LogoutResponse {
    success: boolean;
    message: string;
}

export async function userLogoutApi(): Promise<string> {
    const response = await axiosInstance.get<LogoutResponse>("/auth/logout", {withCredentials: true});
    return response.data.message;
}