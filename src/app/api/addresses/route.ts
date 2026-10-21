import { NextRequest, NextResponse } from "next/server";
import { mutateCollection, newId, readCollection, type Address } from "@/server/db";
import { getSessionFromRequest } from "@/server/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const addresses = await readCollection("addresses");
  const list = addresses.filter((a) => a.userId === auth.user.id);
  return NextResponse.json({ addresses: list });
}

type AddressBody = {
  id?: string;
  label?: string;
  city?: string;
  line?: string;
  isDefault?: boolean;
};

export async function PUT(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: AddressBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const label = body.label?.trim();
  const city = body.city?.trim();
  const line = body.line?.trim();
  if (!label || !city || !line) {
    return NextResponse.json({ error: "label, city, line required" }, { status: 400 });
  }

  let saved: Address | undefined;

  await mutateCollection("addresses", (addresses) => {
    const userId = auth.user.id;
    if (body.isDefault) {
      for (const a of addresses) {
        if (a.userId === userId) a.isDefault = false;
      }
    }

    if (body.id) {
      const existing = addresses.find((a) => a.id === body.id && a.userId === userId);
      if (existing) {
        existing.label = label;
        existing.city = city;
        existing.line = line;
        if (body.isDefault !== undefined) existing.isDefault = body.isDefault;
        saved = existing;
        return;
      }
    }

    saved = {
      id: newId("addr"),
      userId,
      label,
      city,
      line,
      isDefault: body.isDefault ?? addresses.every((a) => a.userId !== userId),
      createdAt: new Date().toISOString(),
    };
    addresses.push(saved);
  });

  return NextResponse.json({ address: saved });
}

export async function DELETE(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id =
    req.nextUrl.searchParams.get("id") ||
    (await req.json().catch(() => ({})) as { id?: string }).id;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  let removed = false;
  await mutateCollection("addresses", (addresses) => {
    const idx = addresses.findIndex(
      (a) => a.id === id && a.userId === auth.user.id
    );
    if (idx >= 0) {
      addresses.splice(idx, 1);
      removed = true;
    }
  });

  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
