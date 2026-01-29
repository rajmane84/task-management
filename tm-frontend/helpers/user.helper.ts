import axiosInstance from "@/lib/axios-instance";

export async function deleteUserApi() {
    const response = await axiosInstance.delete("/user/me", {withCredentials: true});
    return response;
}

export async function updateAvatarApi(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.patch(
    "/user/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}