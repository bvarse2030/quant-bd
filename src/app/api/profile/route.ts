/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

import { handleRateLimit } from '../utils/rate-limit';
import { getProfileByUserId, createProfile, updateProfile, deleteProfile, getProfileById } from './controller';

const formatResponse = (data: unknown, message: string, status: number) => {
  return NextResponse.json({ data, message }, { status });
};

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const id = url.searchParams.get('id');

  let result;
  if (userId) {
    result = await getProfileByUserId(req);
  } else if (id) {
    result = await getProfileById(req);
  } else {
    return formatResponse(null, 'userId or id parameter is required', 400);
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await createProfile(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await updateProfile(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await deleteProfile(req);
  return formatResponse(result.data, result.message, result.status);
}
