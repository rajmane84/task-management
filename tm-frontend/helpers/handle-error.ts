import axios from "axios";
import { toast } from "sonner";

export function handleApiError(
  error: unknown,
  fallbackMessage = "Something went wrong"
) {
  // Axios-related errors
  if (axios.isAxiosError(error)) {
    // 1️⃣ Backend responded with an error (4xx / 5xx)
    if (error.response) {
      const message =
        (error.response.data as any)?.message ||
        error.response.statusText ||
        fallbackMessage;

      console.error("API Response Error:", error.response);
      toast.error(message);
      return;
    }

    // 2️⃣ Request was made but no response (server down / CORS / timeout)
    console.error("Server unreachable:", error.message);
    toast.error("Server is unreachable. Please try again later.");
    return;
  }

  // 3️⃣ Non-Axios / unexpected errors
  const errorMessage = error instanceof Error ? error.message : "Something went wrong";
  console.error("Unexpected Error:", errorMessage);
  toast.error(fallbackMessage);
}
