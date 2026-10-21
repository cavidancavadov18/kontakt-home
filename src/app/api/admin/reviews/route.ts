import { NextRequest, NextResponse } from "next/server";
import { readCollection } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const reviews = await readCollection("reviews");
  const sorted = [...reviews].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  return NextResponse.json({ reviews: sorted });
}
