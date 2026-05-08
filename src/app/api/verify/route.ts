/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { formatResponse } from '../utils/utils';

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    const response = formatResponse(null, 'Missing token', 400);
    return NextResponse.json(response, { status: response.status });
  }

  try {
    const payload = jwt.verify(token, EMAIL_TOKEN_SECRET) as { email: string };
    const email = payload.email;

    const response = formatResponse({ email }, 'Email verified successfully', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error verifying token:', error);

    let response;

    if (error instanceof jwt.JsonWebTokenError) {
      response = formatResponse(null, 'Invalid token', 400);
    } else if (error instanceof jwt.TokenExpiredError) {
      response = formatResponse(null, 'Token has expired', 400);
    } else {
      const err = error as { code?: string | number; keyValue?: Record<string, unknown> };

      if (err.keyValue) {
        response = formatResponse(null, `Database error: ${JSON.stringify(err.keyValue)}`, 500);
      } else {
        response = formatResponse(null, 'An unexpected error occurred during verification', 500);
      }
    }

    return NextResponse.json(response, { status: response.status });
  }
}
