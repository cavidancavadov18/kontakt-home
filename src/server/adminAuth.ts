import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "kh_admin";
const ADMIN_TTL_MS = 12 * 60 * 60 * 1000;

const ADMIN_USERS: Record<string, string> = {
  superadmin: "admin",
  admin: "admin",
};

function secret(): string {
  return process.env.KH_SECRET || "kontakt-dev-secret-change-me";
}

function sign(payload: string): string {
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return payload;
}

export function loginAdmin(
  username: string,
  password: string
): string | null {
  const user = username.trim().toLowerCase();
  const expected = ADMIN_USERS[user];
  if (!expected || expected !== password) return null;

  const payload = Buffer.from(
    JSON.stringify({
      u: user,
      exp: Date.now() + ADMIN_TTL_MS,
    }),
    "utf8"
  ).toString("base64url");
  return sign(payload);
}

export function getAdminFromRequest(
  req: NextRequest
): { username: string } | null {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payloadB64 = verifyToken(token);
  if (!payloadB64) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { u?: string; exp?: number };
    if (!parsed.u || !parsed.exp || parsed.exp < Date.now()) return null;
    if (!(parsed.u in ADMIN_USERS)) return null;
    return { username: parsed.u };
  } catch {
    return null;
  }
}

export function setAdminCookie(res: NextResponse, token: string): void {
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_TTL_MS / 1000,
  });
}

export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
