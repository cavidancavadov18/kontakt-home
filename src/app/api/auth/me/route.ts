import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/server/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user } = auth;
  return NextResponse.json({
    user: { id: user.id, phone: user.phone, name: user.name },
  });
}
