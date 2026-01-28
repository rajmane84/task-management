import { userLoginApi, userLogoutApi, userRegistrationApi } from "@/helpers/auth.helper";
import { handleApiError } from "@/helpers/handle-error";
import { LoginInput } from "@/lib/schema/login.schema";
import type { SignupInput } from "@/lib/schema/signup.schema";

export async function logoutUser(){
    try {
        const message = await userLogoutApi();
        return message;
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function registerUser(data: SignupInput) {
    try {
        const response = await userRegistrationApi(data); 
        return response;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}

export async function loginUser(data: LoginInput) {
    try {
        const response = await userLoginApi(data);
        return response;
    } catch (error: unknown){
        handleApiError(error);
        return null
    }
}