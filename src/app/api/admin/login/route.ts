import { NextRequest, NextResponse } from "next/server";
import { loginAdmin, setAdminCookie } from "@/server/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = body.username?.trim() || "";
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const token = loginAdmin(username, password);
  if (!token) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    username: username.trim().toLowerCase(),
  });
  setAdminCookie(res, token);
  return res;
}
