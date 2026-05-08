/*
|-----------------------------------------
| setting up JwtUtils for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface JwtPayload {
  email: string;
}
interface VerifiedJwtPayload {
  email: string;
  iat: number;
  exp: number;
}

export function createJwt(email: string): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not configured in environment variables.');
    throw new Error('JWT secret is not configured.');
  }

  const payload: JwtPayload = { email };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  return token;
}

export function verifyJwt(token: string): { isValid: boolean; payload?: VerifiedJwtPayload } {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not configured in environment variables.');
    return { isValid: false };
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as VerifiedJwtPayload;

    return { isValid: true, payload: decoded };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log('JWT verification failed: Token has expired.');
    } else if (error instanceof JsonWebTokenError) {
      console.log(`JWT verification failed: ${error.message}`);
    } else {
      console.error('An unexpected error occurred during JWT verification:', error);
    }

    return { isValid: false };
  }
}
