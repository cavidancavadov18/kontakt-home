import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "./adminAuth";

export function requireAdmin(
  req: NextRequest
): { username: string } | NextResponse {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return admin;
}

export function isAdminError(
  result: { username: string } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
