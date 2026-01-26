import { createCardApi } from "@/helpers/card.helper";
import { handleApiError } from "@/helpers/handle-error";

export async function handleCreateCard(data: any) {
    try {
        const card = await createCardApi(data);
        console.log("New card created");
        return card
    } catch (error: any) {
        console.log(error);
        handleApiError(error)
    }
}