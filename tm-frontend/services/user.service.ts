import { handleApiError } from "@/helpers/handle-error";
import { deleteUserApi, updateAvatarApi } from "@/helpers/user.helper";
import { unknown } from "zod";

export async function deleteUser(){
    try {
        const response = await deleteUserApi();
        return response;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}

export async function updateUserAvatar(file: File) {
    try {
        const response = await updateAvatarApi(file);
        return response;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}