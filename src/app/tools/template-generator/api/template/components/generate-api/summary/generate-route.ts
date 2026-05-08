/*
|-----------------------------------------
| setting up GenerateRoute for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface NamingConvention {
  User_3_000___: string;
}

interface InputConfig {
  namingConvention: NamingConvention;
}

export function generateSummaryRoute(inputJsonString: string): string {
  const config: InputConfig = JSON.parse(inputJsonString);
  const { namingConvention } = config;

  const singularName = namingConvention.User_3_000___;

  const getSummaryFunction = `get${singularName}Summary`;

  const routeTemplate = `
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { ${getSummaryFunction} } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET ${singularName} Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await ${getSummaryFunction}(req);
    return formatResponse(result.data, result.message, result.status);
}
`;
  return routeTemplate.trim();
}
