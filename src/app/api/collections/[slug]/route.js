import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// 30s TTL Collection detail Cache
const cache = new Map();
const CACHE_TTL = 30000;

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { timestamp: Date.now(), data });
}

export async function GET(request, { params }) {
  const cacheKey = request.url;
  const cachedData = getCached(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData, {
      headers: {
        "X-Cache": "HIT",
        "Cache-Control": "public, max-age=30, stale-while-revalidate=15",
      },
    });
  }

  const { slug } = await params;
  const db = getDb();
  const collection = db
    .prepare("SELECT * FROM collections WHERE slug = ?")
    .get(slug);
  if (!collection)
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  const products = db
    .prepare(
      "SELECT p.* FROM products p WHERE p.collection_id = ? ORDER BY p.created_at DESC",
    )
    .all(collection.id);
  const parsed = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    colors: JSON.parse(p.colors || "[]"),
  }));
  const responseData = { collection, products: parsed };
  setCached(cacheKey, responseData);

  return NextResponse.json(responseData, {
    headers: {
      "X-Cache": "MISS",
      "Cache-Control": "public, max-age=30, stale-while-revalidate=15",
    },
  });
}
