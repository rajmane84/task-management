import { User } from "../models/user.model";

export async function generateUsername(email: string): Promise<string> {
  if (!email) {
    throw new Error("Email is required to generate username");
  }

  const base: string = (email?.split("@")[0] ?? "").toLowerCase().replace(/[^a-z0-9_]/g, "");

  if (!base) {
    throw new Error("Unable to generate username from email");
  }

  let username: string = base;
  let suffix: number = 0;

  // User.exists() returns Promise<{ _id: any } | null>
  while (await User.exists({ username })) {
    suffix++;
    username = `${base}${suffix}`;
  }

  return username;
}
