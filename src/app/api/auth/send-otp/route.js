import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = getDb();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Rate Limiter: Prevent spamming emails (max once per 60 seconds)
    const lastRequest = db.prepare('SELECT created_at FROM email_verifications WHERE email = ?').get(email);
    if (lastRequest) {
      const timeElapsed = Date.now() - new Date(lastRequest.created_at + ' UTC').getTime();
      if (timeElapsed < 60 * 1000) {
        const remaining = Math.ceil((60 * 1000 - timeElapsed) / 1000);
        return NextResponse.json({ error: `Please wait ${remaining} seconds before requesting a new code.` }, { status: 429 });
      }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Upsert into email_verifications
    db.prepare(`
      INSERT INTO email_verifications (email, otp, expires_at)
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET otp = excluded.otp, expires_at = excluded.expires_at, created_at = CURRENT_TIMESTAMP
    `).run(email, otp, expiresAt);

    // Send email using Nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"AÉRE" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your AÉRE Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; color: #1a1410;">
            <h1 style="font-weight: 300; letter-spacing: 2px;">A É R E</h1>
            <p style="font-size: 16px; margin-top: 40px;">Your verification code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #1a1410; margin: 20px 0;">${otp}</h2>
            <p style="font-size: 14px; color: #6b5e54; margin-top: 40px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      return NextResponse.json({ message: 'OTP sent successfully to your email' }, { status: 200 });
    } else {
      // Fallback for local testing if env vars are not set
      return NextResponse.json({ message: 'OTP generated (Mock Mode)', _demoOtp: otp }, { status: 200 });
    }

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
