import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getWeaveSpecs } from "@/lib/specs";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = await params;
  const db = getDb();
  const product = db
    .prepare(
      `SELECT p.*, c.name as collection_name, c.slug as collection_slug FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE p.slug = ?`,
    )
    .get(slug);
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const reviews = db
    .prepare(
      "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
    )
    .all(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const related = db
    .prepare(
      `SELECT p.*, c.name as collection_name FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE p.category = ? AND p.id != ? LIMIT 4`,
    )
    .all(product.category, product.id);

  return NextResponse.json({
    product: {
      ...product,
      images: JSON.parse(product.images || "[]"),
      sizes: JSON.parse(product.sizes || "[]"),
      colors: JSON.parse(product.colors || "[]"),
      weaveSpecs: getWeaveSpecs(product.material),
    },
    reviews,
    avgRating: Math.round(avgRating * 10) / 10,
    related: related.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      sizes: JSON.parse(p.sizes || "[]"),
      colors: JSON.parse(p.colors || "[]"),
    })),
  });
}
