import axiosInstance from "@/lib/axios-instance";

type Role = "editor" | "viewer";

export interface GenerateShareLinkPayload {
  targetId: string;
  role: Role;
  expiresAt?: string;
  maxUses: number | null;
}


export async function generateShareLinkApi(payload: GenerateShareLinkPayload) {
    const response = await axiosInstance.post("/share", payload);
    return response.data
}