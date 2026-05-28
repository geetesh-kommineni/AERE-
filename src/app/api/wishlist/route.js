import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  const payload = await getUserFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const items = db.prepare(`SELECT w.*, p.name, p.slug, p.price, p.original_price, p.material, p.images, p.badge FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ? ORDER BY w.created_at DESC`).all(payload.id);
  const parsed = items.map(i => ({ ...i, images: JSON.parse(i.images || '[]') }));
  return NextResponse.json({ wishlist: parsed });
}

export async function POST(request) {
  const payload = await getUserFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { product_id } = await request.json();
  const db = getDb();
  try {
    db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(payload.id, product_id);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Already in wishlist' }, { status: 409 });
  }
}

export async function DELETE(request) {
  const payload = await getUserFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { product_id } = await request.json();
  const db = getDb();
  db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(payload.id, product_id);
  return NextResponse.json({ success: true });
}
