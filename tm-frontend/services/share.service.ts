import { handleApiError } from "@/helpers/handle-error";
import { generateShareLinkApi, type GenerateShareLinkPayload } from "@/helpers/share.helper";


export async function generateShareLink(payload: GenerateShareLinkPayload){
    try {
        const response = await generateShareLinkApi(payload);
        return response;
    } catch (error: unknown) {
        handleApiError(error);
        return null;
    }
}