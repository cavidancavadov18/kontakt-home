import { NextRequest, NextResponse } from "next/server";
import {
  mutateCollection,
  newId,
  readCollection,
  type User,
} from "@/server/db";
import { normalizePhone } from "@/server/phone";
import {
  createSession,
  setSessionCookie,
} from "@/server/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { phone?: string; code?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = body.phone ? normalizePhone(body.phone) : "";
  const code = body.code?.trim() || "";
  if (!phone || !code) {
    return NextResponse.json({ error: "Phone and code required" }, { status: 400 });
  }

  const otps = await readCollection("otps");
  const otp = otps.find((o) => o.phone === phone);
  if (!otp || otp.code !== code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }
  if (new Date(otp.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: "Code expired" }, { status: 401 });
  }

  await mutateCollection("otps", (list) => {
    const idx = list.findIndex((o) => o.phone === phone);
    if (idx >= 0) list.splice(idx, 1);
  });

  let user: User | undefined;
  await mutateCollection("users", (users) => {
    user = users.find((u) => u.phone === phone);
    if (!user) {
      user = {
        id: newId("usr"),
        phone,
        name: body.name?.trim() || "",
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    } else if (body.name?.trim()) {
      user.name = body.name.trim();
    }
  });

  if (!user) {
    return NextResponse.json({ error: "User creation failed" }, { status: 500 });
  }

  const token = await createSession(user.id);
  const res = NextResponse.json({
    user: { id: user.id, phone: user.phone, name: user.name },
  });
  setSessionCookie(res, token);
  return res;
}
