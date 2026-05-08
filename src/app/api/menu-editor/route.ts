/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextRequest } from 'next/server';

import { getMenu, updateMenu } from './controller';
import { handleRateLimit } from '../utils/rate-limit';
import { isUserHasAccessByRole, IWantAccess } from '../utils/is-user-has-access-by-role';

export async function GET(req: NextRequest) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'menu editor',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const type = req.nextUrl.searchParams.get('type') || 'main-menu';
  return getMenu(type);
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'menu editor',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  return updateMenu(req);
}
