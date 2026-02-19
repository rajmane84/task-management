import type { CookieOptions } from "express";

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
}

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const NODE_ENV = process.env.NODE_ENV;

export const FILE_SIZE = 1024 * 1024 * 5;
