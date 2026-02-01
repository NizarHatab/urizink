import * as jose from "jose";
import { compare, hash } from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET ?? "urizink-admin-secret-change-in-production";
const COOKIE_NAME = "urizink_admin_token";
const TOKEN_MAX_AGE_SEC = 7 * 24 * 60 * 60; // 7 days

export const authConfig = {
  cookieName: COOKIE_NAME,
  tokenMaxAgeSec: TOKEN_MAX_AGE_SEC,
};

export type JWTPayload = {
  sub: string;
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
};

async function getSecretKey(): Promise<Uint8Array> {
  const secret = process.env.JWT_SECRET ?? "urizink-admin-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  const key = await getSecretKey();
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE_SEC}s`)
    .sign(key);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const key = await getSecretKey();
    const { payload } = await jose.jwtVerify(token, key);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  return compare(password, hashStr);
}
