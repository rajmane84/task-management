import axiosInstance from "@/lib/axios-instance";

export async function deleteUserApi() {
    const response = await axiosInstance.delete("/user/me", {withCredentials: true});
    return response;
}