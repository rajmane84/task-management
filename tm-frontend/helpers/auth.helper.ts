import axiosInstance, { MyAxiosInstance } from "@/lib/axios-instance";
import { LoginInput } from "@/lib/schema/login.schema";
import type { SignupInput } from "@/lib/schema/signup.schema";

interface UserRegistrationResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    username: string;
  };
}

interface UserLoginResponse extends UserRegistrationResponse {}

export async function userLogoutApi() {
  const { data } = await axiosInstance.get<MyAxiosInstance>("/auth/logout", {
    withCredentials: true,
  });
  return data;
}

export async function userRegistrationApi(inputData: SignupInput) {
  const { data } = await axiosInstance.post<
    MyAxiosInstance<UserRegistrationResponse>
  >("/auth/register", inputData);

  return data;
}

export async function userLoginApi(inputData: LoginInput) {
  const { data } = await axiosInstance.post<MyAxiosInstance<UserLoginResponse>>(
    "/auth/login",
    inputData,
  );

  return data;
}

export async function handleGenerateAccessToken() {
  const { data } = await axiosInstance.get<MyAxiosInstance>(
    "/auth/refresh-token",
    {
      withCredentials: true,
    },
  );

  return data;
}
