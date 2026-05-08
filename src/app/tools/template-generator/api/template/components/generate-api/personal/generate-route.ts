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
}

interface InputConfig {
  namingConvention: NamingConvention;
  isPersonal?: boolean;
}

export function generatePersonalRoute(inputJsonString: string): string {
  const config: InputConfig = JSON.parse(inputJsonString);
  const { namingConvention, isPersonal } = config;

  const pluralName = namingConvention.Users_1_000___;
  const singularName = namingConvention.User_3_000___;

  const getPlural = `get${pluralName}`;
  const createSingular = `create${singularName}`;
  const updateSingular = `update${singularName}`;
  const deleteSingular = `delete${singularName}`;
  const getSingularById = `get${singularName}ById`;
  const bulkUpdatePlural = `bulkUpdate${pluralName}`;
  const bulkDeletePlural = `bulkDelete${pluralName}`;

  const controllerImportsList = [getPlural, createSingular, updateSingular, deleteSingular, bulkUpdatePlural, bulkDeletePlural];

  if (!isPersonal) {
    controllerImportsList.push(getSingularById);
  }

  const controllerImportsString = controllerImportsList.join(',\n    ');

  const importsBlock = isPersonal
    ? `import { 
    ${controllerImportsString}
} from './controller';
import { formatResponse } from '@/app/api/utils/jwt-verify';`
    : `import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    ${controllerImportsString}
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';`;

  const getLogic = isPersonal
    ? `const result = await ${getPlural}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await ${getSingularById}(req)
        : await ${getPlural}(req);
    return formatResponse(result.data, result.message, result.status);`;

  const postLogic = isPersonal
    ? `const result = await ${createSingular}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await ${createSingular}(req);
    return formatResponse(result.data, result.message, result.status);`;

  const putLogic = isPersonal
    ? `const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk 
        ? await ${bulkUpdatePlural}(req)
        : await ${updateSingular}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkUpdatePlural}(req)
        : await ${updateSingular}(req);

    return formatResponse(result.data, result.message, result.status);`;

  const deleteLogic = isPersonal
    ? `const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkDeletePlural}(req)
        : await ${deleteSingular}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkDeletePlural}(req)
        : await ${deleteSingular}(req);

    return formatResponse(result.data, result.message, result.status);`;

  const routeTemplate = `
${importsBlock}

// GET all ${isPersonal ? pluralName : `${pluralName} or Single ${singularName} by ID`}
export async function GET(req: Request) {
    ${getLogic}
}

// CREATE ${singularName}
export async function POST(req: Request) {
    ${postLogic}
}

// UPDATE ${singularName}
export async function PUT(req: Request) {
    ${putLogic}
}

// DELETE ${singularName}
export async function DELETE(req: Request) {
    ${deleteLogic}
}
`;

  return routeTemplate.trim();
}
