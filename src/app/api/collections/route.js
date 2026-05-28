import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// 30s TTL Collections Cache
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

export async function GET(request) {
  const cacheKey = request.url;
  const cachedData = getCached(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=15'
      }
    });
  }

  const db = getDb();
  const collections = db.prepare('SELECT * FROM collections ORDER BY id').all();
  const responseData = { collections };
  setCached(cacheKey, responseData);

  return NextResponse.json(responseData, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=15'
    }
  });
}
