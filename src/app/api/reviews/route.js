import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  if (!productId)
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  const db = getDb();
  const reviews = db
    .prepare(
      "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
    )
    .all(productId);
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  return NextResponse.json({
    reviews,
    avgRating: Math.round(avg * 10) / 10,
    total: reviews.length,
  });
}

export async function POST(request) {
  const payload = await getUserFromRequest(request);
  if (!payload)
    return NextResponse.json(
      { error: "Unauthorized: Please log in to submit a review" },
      { status: 401 },
    );
  const { product_id, rating, comment } = await request.json();
  if (!product_id || !rating)
    return NextResponse.json(
      { error: "product_id and rating required" },
      { status: 400 },
    );
  const db = getDb();
  const user = db
    .prepare("SELECT name FROM users WHERE id = ?")
    .get(payload.id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  const userName = user.name;
  db.prepare(
    "INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)",
  ).run(product_id, payload.id, userName, rating, comment || "");
  return NextResponse.json({ success: true }, { status: 201 });
}
