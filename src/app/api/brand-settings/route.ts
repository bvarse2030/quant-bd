/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/app/api/utils/mongoose';

import { handleRateLimit } from '../utils/rate-limit';
import { getBrandSettings, updateBrandSettings } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../utils/is-user-has-access-by-role';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'sidebar',
        access: 'read',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const settings = await getBrandSettings();
    return NextResponse.json(settings, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    if (process.env.AuthorizationEnable === 'true') {
      const wantToAccess: IWantAccess = {
        db_name: 'sidebar',
        access: 'create',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;
    }
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
    }

    const updatedSettings = await updateBrandSettings(body);
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
