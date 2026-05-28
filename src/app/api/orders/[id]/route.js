import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    const db = getDb();
    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 400 });
  }
}
