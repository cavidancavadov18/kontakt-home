import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  mutateCollection,
  newId,
  readCollection,
  type DbSession,
  type User,
} from "./db";

export const SESSION_COOKIE = "kh_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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

export async function createSession(userId: string): Promise<string> {
  const sessionId = newId("sess");
  const now = Date.now();
  const record: DbSession = {
    id: sessionId,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
  };
  await mutateCollection("sessions", (sessions) => {
    sessions.push(record);
    return sessionId;
  });
  const payload = Buffer.from(JSON.stringify({ sid: sessionId }), "utf8").toString(
    "base64url"
  );
  return sign(payload);
}

async function resolveSession(token: string): Promise<DbSession | null> {
  const payloadB64 = verifyToken(token);
  if (!payloadB64) return null;
  let sid: string;
  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
      sid: string;
    };
    sid = parsed.sid;
  } catch {
    return null;
  }
  const sessions = await readCollection("sessions");
  const session = sessions.find((s) => s.id === sid);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await mutateCollection("sessions", (list) => {
      const idx = list.findIndex((s) => s.id === sid);
      if (idx >= 0) list.splice(idx, 1);
    });
    return null;
  }
  return session;
}

export async function getSessionFromRequest(
  req: NextRequest
): Promise<{ session: DbSession; user: User } | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await resolveSession(token);
  if (!session) return null;
  const users = await readCollection("users");
  const user = users.find((u) => u.id === session.userId);
  if (!user) return null;
  return { session, user };
}

export async function destroySession(req: NextRequest): Promise<void> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return;
  const payloadB64 = verifyToken(token);
  if (!payloadB64) return;
  try {
    const { sid } = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
      sid: string;
    };
    await mutateCollection("sessions", (list) => {
      const idx = list.findIndex((s) => s.id === sid);
      if (idx >= 0) list.splice(idx, 1);
    });
  } catch {
    /* ignore */
  }
}

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
