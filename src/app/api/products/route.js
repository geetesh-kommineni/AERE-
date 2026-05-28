import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Elegant in-memory cache with 30-second TTL
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
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  }

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const collection = searchParams.get('collection');
  const department = searchParams.get('department');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const featured = searchParams.get('featured');
  const offset = (page - 1) * limit;

  let where = ['1=1'];
  let params = [];

  const material = searchParams.get('material');
  const color = searchParams.get('color');
  const size = searchParams.get('size');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  if (category) { where.push('p.category = ?'); params.push(category); }
  if (department) { where.push('p.department = ?'); params.push(department); }
  if (collection) {
    where.push('c.slug = ?'); params.push(collection);
  }
  if (featured) { where.push('p.featured = 1'); }
  if (material) { where.push('p.material LIKE ?'); params.push(`%${material}%`); }
  if (color) { where.push('p.colors LIKE ?'); params.push(`%${color}%`); }
  if (size) { where.push('p.sizes LIKE ?'); params.push(`%"${size}"%`); }
  if (minPrice) { where.push('p.price >= ?'); params.push(parseFloat(minPrice)); }
  if (maxPrice) { where.push('p.price <= ?'); params.push(parseFloat(maxPrice)); }
  if (search) { where.push('(p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  let orderBy = 'p.created_at DESC';
  if (sort === 'price-asc') orderBy = 'p.price ASC';
  else if (sort === 'price-desc') orderBy = 'p.price DESC';
  else if (sort === 'name') orderBy = 'p.name ASC';

  const countSql = `SELECT COUNT(*) as total FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE ${where.join(' AND ')}`;
  const total = db.prepare(countSql).get(...params).total;

  const sql = `SELECT p.*, c.name as collection_name, c.slug as collection_slug FROM products p LEFT JOIN collections c ON p.collection_id = c.id WHERE ${where.join(' AND ')} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  const products = db.prepare(sql).all(...params, limit, offset);

  const parsed = products.map(p => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    colors: JSON.parse(p.colors || '[]'),
  }));

  const responseData = { products: parsed, total, page, totalPages: Math.ceil(total / limit) };
  setCached(cacheKey, responseData);

  return NextResponse.json(responseData, {
    headers: { 
      'X-Cache': 'MISS',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  });
}
