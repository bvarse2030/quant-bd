/*
|-----------------------------------------
| setting up RateLimit for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

export const RATE_LIMIT = 100; // 50 requests
export const TIME_WINDOW = 60 * 1000; // 1 minute

export const rateLimitMap = new Map<string, { count: number; timer: NodeJS.Timeout }>();

export const rateLimit = (ip: string, RATE_LIMIT: number = 50, TIME_WINDOW: number = 60 * 1000) => {
  if (!rateLimitMap.has(ip)) {
    const timer = setTimeout(() => rateLimitMap.delete(ip), TIME_WINDOW);
    rateLimitMap.set(ip, { count: 1, timer });
    return true;
  }

  const record = rateLimitMap.get(ip)!;
  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
};

export const getClientIp = (req: Request) => {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
};

export const handleRateLimit = (req: Request) => {
  const ip = getClientIp(req);
  if (!rateLimit(ip, RATE_LIMIT, TIME_WINDOW)) {
    return NextResponse.json({ data: null, message: 'Too many requests. Please try again later.', status: 429 }, { status: 429 });
  }
  return null;
};
