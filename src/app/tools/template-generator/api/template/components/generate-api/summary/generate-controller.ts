/*
|-----------------------------------------
| setting up GenerateController for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

interface InputConfig {
  schema: Record<string, string>;
  namingConvention: {
    User_3_000___: string;
  };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function generateSummaryController(inputJsonString: string): string {
  const config: InputConfig = JSON.parse(inputJsonString);
  const { namingConvention, schema } = config;

  const singularName = namingConvention.User_3_000___;
  const getSummaryFunction = `get${singularName}Summary`;

  const numericFields = Object.keys(schema).filter(key => schema[key] === 'INTNUMBER' || schema[key] === 'FLOATNUMBER');

  if (numericFields.length === 0) {
    return `
import { withDB } from '@/app/api/utils/db';
import ${singularName} from '../model';

import { formatResponse, IResponse } from '@/app/api/utils/utils';

export async function ${getSummaryFunction}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs] = await Promise.all([
            ${singularName}.countDocuments({}),
            ${singularName}.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
        ]);

        return formatResponse(
            {
                overall: {
                    totalRecords: totalDocs,
                    recordsLast24Hours: last24HoursDocs,
                },
                monthlyTable: [], // No numeric fields to aggregate
                tableSummary: { totalMonths: 0 },
                pagination: { currentPage: 1, limit: 10, totalMonths: 0, totalPages: 0 },
            },
            'Summary fetched successfully',
            200
        );
    });
}
        `.trim();
  }

  const aggregationResultInterface = numericFields.map(field => `    total${capitalize(field)}: number;`).join('\n');

  const groupStageSums = numericFields.map(field => `                        total${capitalize(field)}: { $sum: '$${field}' },`).join('\n');

  const monthlyTableProperties = numericFields.map(field => `                total${capitalize(field)}: stat.total${capitalize(field)} || 0,`).join('\n');

  const initialAccumulator = numericFields.map(field => `grandTotal${capitalize(field)}: 0,`).join(' ');

  const reduceLogic = numericFields.map(field => `            acc.grandTotal${capitalize(field)} += curr.total${capitalize(field)};`).join('\n');

  const controllerTemplate = `
import { withDB } from '@/app/api/utils/db';
import ${singularName} from '../model';


import { formatResponse, IResponse } from '@/app/api/utils/utils';

interface AggregationResult {
    _id: {
        month: number;
        year: number;
    };
${aggregationResultInterface}
}

export async function ${getSummaryFunction}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
            ${singularName}.countDocuments({}),
            ${singularName}.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
            ${singularName}.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                        },
${groupStageSums}
                    },
                },
                {
                    $sort: { '_id.year': -1, '_id.month': -1 },
                },
            ]),
        ]);

        const fullMonthlyTable = monthlyStatsRaw.map((stat) => {
            const date = new Date();
            date.setMonth(stat._id.month - 1);
            const monthName = date.toLocaleString('default', { month: 'long' });

            return {
                month: \`\${monthName} \${stat._id.year}\`,
${monthlyTableProperties}
            };
        });

        const tableSummary = fullMonthlyTable.reduce(
            (acc, curr) => {
                acc.totalMonths += 1;
${reduceLogic}
                return acc;
            },
            { totalMonths: 0, ${initialAccumulator} }
        );

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedMonthlyTable = fullMonthlyTable.slice(startIndex, endIndex);

        return formatResponse(
            {
                overall: {
                    totalRecords: totalDocs,
                    recordsLast24Hours: last24HoursDocs,
                },
                monthlyTable: paginatedMonthlyTable,
                tableSummary,
                pagination: {
                    currentPage: page,
                    limit,
                    totalMonths: fullMonthlyTable.length,
                    totalPages: Math.ceil(fullMonthlyTable.length / limit),
                },
            },
            'Summary fetched successfully',
            200
        );
    });
}
`;
  return controllerTemplate.trim();
}
