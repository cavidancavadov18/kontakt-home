import { NextRequest, NextResponse } from "next/server";
import { mutateCollection } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const { id } = await params;
  let body: { status?: "open" | "closed" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status !== "open" && body.status !== "closed") {
    return NextResponse.json(
      { error: "status must be open|closed" },
      { status: 400 }
    );
  }

  const ticket = await mutateCollection("tickets", (tickets) => {
    const found = tickets.find((t) => t.id === id);
    if (!found) return null;
    found.status = body.status!;
    return found;
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  return NextResponse.json({ ticket });
}
