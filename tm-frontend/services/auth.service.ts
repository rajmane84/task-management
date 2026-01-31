import { handleGenerateAccessToken, userLoginApi, userLogoutApi, userRegistrationApi } from "@/helpers/auth.helper";
import { handleApiError } from "@/helpers/handle-error";
import { LoginInput } from "@/lib/schema/login.schema";
import type { SignupInput } from "@/lib/schema/signup.schema";

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    username: string;
}

export async function logoutUser(): Promise<string | null>{
    try {
        const response = await userLogoutApi();
        return response.message;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}

export async function registerUser(inputData: SignupInput): Promise<AuthResponse | null> {
    try {
        const response = await userRegistrationApi(inputData); 
        return response.data!.user;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}

export async function loginUser(inputData: LoginInput): Promise<AuthResponse | null> {
    try {
        const response = await userLoginApi(inputData);
        return response.data!.user;
    } catch (error: unknown){
        handleApiError(error);
        return null
    }
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const response = await handleGenerateAccessToken();
        return response.message;
    } catch (error: unknown) {
        handleApiError(error)
        return null;
    }
}