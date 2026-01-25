import { userLogoutApi } from "@/helpers/auth.helper";
import { handleApiError } from "@/helpers/handle-error";

export async function logoutUser(){
    try {
        const message = await userLogoutApi();
        return message;
    } catch (error: any) {
        handleApiError(error);
    }
}