import { NextRequest, NextResponse } from "next/server";
import { mutateCollection, newId, type Ticket } from "@/server/db";
import { normalizePhone } from "@/server/phone";
import { getSessionFromRequest } from "@/server/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { message?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const auth = await getSessionFromRequest(req);
  const phone = body.phone
    ? normalizePhone(body.phone)
    : auth?.user.phone ?? null;

  const ticket: Ticket = {
    id: newId("tkt"),
    message,
    phone,
    userId: auth?.user.id ?? null,
    createdAt: new Date().toISOString(),
    status: "open",
  };

  await mutateCollection("tickets", (tickets) => {
    tickets.unshift(ticket);
  });

  return NextResponse.json({ ok: true, ticket }, { status: 201 });
}
