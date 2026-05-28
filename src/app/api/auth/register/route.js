import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, otp } = await request.json();
    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: 'Name, email, password and verification code are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    const db = getDb();
    
    // Verify OTP
    const verification = db.prepare('SELECT otp, expires_at FROM email_verifications WHERE email = ?').get(email);
    if (!verification) {
      return NextResponse.json({ error: 'Verification code not requested or expired' }, { status: 400 });
    }
    if (verification.otp !== otp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }
    const password_hash = await hashPassword(password);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, password_hash);
    
    // Cleanup OTP
    db.prepare('DELETE FROM email_verifications WHERE email = ?').run(email);

    const token = await signToken({ id: result.lastInsertRowid, email, name });
    const response = NextResponse.json({ token, user: { id: result.lastInsertRowid, name, email } }, { status: 201 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
