/*
|-----------------------------------------
| setting up JwtVerify for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

import { verifyJwt } from './jwt-utils';

export interface IResponse {
  data: unknown;
  message: string;
  status: number;
}
export const formatResponse = (data: unknown, message: string, status: number) => NextResponse.json({ data, message, status }, { status });

export const handleTokenVerify = (req: Request) => {
  const authorizationToken = req.headers.get('authorization');
  const token = authorizationToken?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ data: null, message: 'Please provide a token', status: 430 }, { status: 430 });
  } else if (token) {
    const result = verifyJwt(token);
    if (result.isValid) {
      return null;
    } else {
      return NextResponse.json({ data: null, message: 'token is expire', status: 432 }, { status: 432 });
    }
  }
  return NextResponse.json({ data: null, message: 'Please provide a valid token', status: 433 }, { status: 433 });
};
