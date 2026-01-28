import axiosInstance from "@/lib/axios-instance";
import { LoginInput } from "@/lib/schema/login.schema";
import type { SignupInput } from "@/lib/schema/signup.schema";

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

export async function userRegistrationApi(data: SignupInput) {
    const response = await axiosInstance.post("/auth/register", data);
    return response;
}

export async function userLoginApi(data:LoginInput) {
    const response = await axiosInstance.post("/auth/login", data);
    return response;
}