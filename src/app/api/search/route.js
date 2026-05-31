import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ products: [], total: 0 });
  const db = getDb();
  const products = db
    .prepare(
      `SELECT p.*, c.name as collection_name FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ? OR p.category LIKE ? ORDER BY p.featured DESC, p.created_at DESC LIMIT 20`,
    )
    .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  const parsed = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    colors: JSON.parse(p.colors || "[]"),
  }));
  return NextResponse.json({ products: parsed, total: parsed.length });
}
