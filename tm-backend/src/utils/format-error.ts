import type { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  const formatted: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";

    if (formatted[field]) continue;

    if (issue.code === "invalid_type") {
      formatted[field] =
        `${field} is required and must be of type ${issue.expected}`;
    } else {
      formatted[field] = issue.message;
    }
  }

  return formatted;
}
