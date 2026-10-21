import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { mutateCollection } from "@/server/db";
import { normalizePhone } from "@/server/phone";

export const dynamic = "force-dynamic";

const OTP_TTL_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const phone = body.phone ? normalizePhone(body.phone) : "";
  if (phone.length < 9) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const code = String(randomInt(1000, 10000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await mutateCollection("otps", (otps) => {
    const idx = otps.findIndex((o) => o.phone === phone);
    const record = { phone, code, expiresAt };
    if (idx >= 0) otps[idx] = record;
    else otps.push(record);
  });

  return NextResponse.json({ ok: true, code });
}
