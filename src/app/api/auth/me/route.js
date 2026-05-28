import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  const payload = await getUserFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?').get(payload.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  let token = null;
  if (request.cookies && typeof request.cookies.get === 'function') {
    token = request.cookies.get('token')?.value;
  }
  if (!token) {
    const auth = request.headers.get('authorization');
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
  }
  return NextResponse.json({ user, token });
}
