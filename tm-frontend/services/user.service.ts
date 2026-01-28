import { handleApiError } from "@/helpers/handle-error";
import { deleteUserApi } from "@/helpers/user.helper";

export async function deleteUser(){
    try {
        const response = await deleteUserApi();
        return response;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}