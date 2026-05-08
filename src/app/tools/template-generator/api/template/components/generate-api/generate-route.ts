/*
|-----------------------------------------
| setting up GenerateRoute for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface NamingConvention {
  Users_1_000___: string;
  User_3_000___: string;
  user_4_000___: string;
}

interface InputConfig {
  namingConvention: NamingConvention;
}

export function generateRoute(inputJsonString: string): string {
  const config: InputConfig = JSON.parse(inputJsonString);
  const { namingConvention } = config;

  const pluralName = namingConvention.Users_1_000___;
  const singularName = namingConvention.User_3_000___;
  const singularNameLowerCase = namingConvention.user_4_000___;

  const getPlural = `get${pluralName}`;
  const createSingular = `create${singularName}`;
  const updateSingular = `update${singularName}`;
  const deleteSingular = `delete${singularName}`;
  const getSingularById = `get${singularName}ById`;
  const bulkUpdatePlural = `bulkUpdate${pluralName}`;
  const bulkDeletePlural = `bulkDelete${pluralName}`;

  const routeTemplate = `
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    ${getPlural},
    ${createSingular},
    ${updateSingular},
    ${deleteSingular},
    ${getSingularById},
    ${bulkUpdatePlural},
    ${bulkDeletePlural},
} from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';
import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all ${pluralName}
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

          const wantToAccess: IWantAccess = {
        db_name: '${singularNameLowerCase}',
        access: 'read',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await ${getSingularById}(req)
        : await ${getPlural}(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE ${singularName}
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

      const wantToAccess: IWantAccess = {
        db_name: '${singularNameLowerCase}',
        access: 'create',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const result = await ${createSingular}(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE ${singularName}
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

      const wantToAccess: IWantAccess = {
        db_name: '${singularNameLowerCase}',
        access: 'update',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkUpdatePlural}(req)
        : await ${updateSingular}(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE ${singularName}
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

      const wantToAccess: IWantAccess = {
        db_name: '${singularNameLowerCase}',
        access: 'delete',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkDeletePlural}(req)
        : await ${deleteSingular}(req);

    return formatResponse(result.data, result.message, result.status);
}
`;
  return routeTemplate.trim();
}
