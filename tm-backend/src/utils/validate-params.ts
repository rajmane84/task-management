import mongoose from "mongoose";

interface ValidationResult {
  success: boolean;
  message?: string;
  value?: string;
}

export function validateParams(
  param: string | string[] | undefined,
): ValidationResult {
  if (!param) {
    return { success: false, message: "Parameter is missing." };
  }

  // If array, take the first value only
  if (Array.isArray(param)) {
    param = param[0];
  }

  // Reject multiple values in a single string (e.g., "123,456")
  if (typeof param === "string" && param.includes(",")) {
    return { success: false, message: "Only one value is allowed." };
  }

  return { success: true, value: param };
}
