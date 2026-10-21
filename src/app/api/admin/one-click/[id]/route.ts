import { NextRequest, NextResponse } from "next/server";
import { mutateCollection } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const { id } = await params;
  const removed = await mutateCollection("oneClick", (list) => {
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    list.splice(idx, 1);
    return true;
  });

  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
