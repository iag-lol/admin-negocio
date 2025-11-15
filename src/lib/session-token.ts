import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  employee_id: string;
  role: string;
  store_id: string;
  fullName?: string;
}

export const SESSION_COOKIE_NAME = "eliana.session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET env variable is required");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const result = await jwtVerify(token, getSecretKey());
    return result.payload as SessionPayload;
  } catch {
    return null;
  }
}
