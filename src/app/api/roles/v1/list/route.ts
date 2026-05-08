/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { getRoleNames } from './controller';

import { formatResponse } from '@/app/api/utils/jwt-verify';
import { handleRateLimit } from '@/app/api/utils/rate-limit';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await getRoleNames(req);

  return formatResponse(result.data, result.message, result.status);
}
