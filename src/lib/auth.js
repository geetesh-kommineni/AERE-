import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'aura-secret-key-2026-considered-fashion');

export async function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request) {
  let token = null;

  // 1. Try reading HTTP-Only cookie first
  if (request.cookies && typeof request.cookies.get === 'function') {
    token = request.cookies.get('token')?.value;
  }

  // 2. Fall back to parsing the Cookie header manually
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;)\s*token\s*=\s*([^;]+)/);
      if (match) token = match[1];
    }
  }

  // 3. Fall back to Authorization Bearer header
  if (!token) {
    const auth = request.headers.get('authorization');
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminFromRequest(request) {
  const payload = await getUserFromRequest(request);
  if (!payload) return null;
  
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@aere.com,admin@aura.com').split(',');
  if (adminEmails.includes(payload.email)) {
    return payload;
  }
  return null;
}

