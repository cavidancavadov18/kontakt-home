import { NextRequest, NextResponse } from "next/server";
import { mutateCollection, newId, readCollection, type Review } from "@/server/db";
import { getSessionFromRequest } from "@/server/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const reviews = await readCollection("reviews");
  const list = reviews
    .filter((r) => r.slug === slug)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ reviews: list });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  let body: { author?: string; rating?: number; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rating = Number(body.rating);
  const text = body.text?.trim() || "";
  if (!text || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const auth = await getSessionFromRequest(req);
  const author =
    body.author?.trim() || auth?.user.name || auth?.user.phone || "Guest";

  const review: Review = {
    id: newId("rev"),
    slug,
    author,
    rating,
    text,
    createdAt: new Date().toISOString(),
  };

  await mutateCollection("reviews", (reviews) => {
    reviews.unshift(review);
  });

  return NextResponse.json({ review }, { status: 201 });
}
