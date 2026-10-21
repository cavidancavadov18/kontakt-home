import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, destroySession } from "@/server/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await destroySession(req);
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
