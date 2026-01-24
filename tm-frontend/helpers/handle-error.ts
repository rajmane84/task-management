import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: { message?: string };
    statusText?: string;
    status?: number;
  };
  request?: any;
}

export function handleApiError(error: ApiError, fallbackMessage = "Something went wrong") {
  // Request reached to backend -> but got an error in response ( status code with 400, 500 )
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText || fallbackMessage;
    console.error("API Response Error:", error.response);
    toast.error(`Failed: ${message}`);
  }
  // If the request was made but no response received
  else if (error.request) {
    console.error("No Response:", error.request);
    toast.error("No response from server. Please check your connection or try again later.");
  }
  // Other errors (network issues, code errors, etc.)
  else {
    console.error("Error:", error.message);
    toast.error(error.message || fallbackMessage);
  }
}
