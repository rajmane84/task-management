export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const NODE_ENV = process.env.NODE_ENV;

export const FILE_SIZE = 1024 * 1024 * 5;
