/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

import { formatResponse, IResponse } from '../utils/utils';

const GMAIL_USER = process.env.GMAIL_USER!;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !EMAIL_TOKEN_SECRET) {
  throw new Error('Missing env vars: GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_TOKEN_SECRET');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request): Promise<NextResponse<IResponse>> {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      const response = formatResponse(null, 'Invalid email provided.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    const token = jwt.sign({ email }, EMAIL_TOKEN_SECRET, { expiresIn: '1h' });
    const verificationUrl = `${BASE_URL}/api/verify?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    const response = formatResponse(null, 'Verification email sent successfully.', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error sending verification email:', error);

    const err = error as { code?: string; message?: string; keyValue?: Record<string, unknown> };

    let response: IResponse;

    if (err.code === 'EENVELOPE') {
      response = formatResponse(null, `Email delivery failed: ${err.message || 'Check recipient/sender.'}`, 400);
    } else if (err.code === 'EAUTH') {
      response = formatResponse(null, `Email server authentication failed. Please check GMAIL_APP_PASSWORD.`, 500);
    } else if (err.keyValue) {
      response = formatResponse(null, `Failed to send email due to a data conflict: ${JSON.stringify(err.keyValue)}`, 500);
    } else {
      response = formatResponse(null, 'An unexpected internal server error occurred.', 500);
    }

    return NextResponse.json(response, { status: response.status });
  }
}
