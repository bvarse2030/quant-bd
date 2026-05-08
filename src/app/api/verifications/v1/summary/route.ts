/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse,  IResponse } from '@/app/api/utils/jwt-verify';

import { getVerificationSummary } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;



  const result: IResponse = await getVerificationSummary(req);
  return formatResponse(result.data, result.message, result.status);
}
