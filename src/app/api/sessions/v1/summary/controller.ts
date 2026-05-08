/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Session from '../model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getSessionSummary(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalDocs, last24HoursDocs] = await Promise.all([Session.countDocuments({}), Session.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } })]);

    return formatResponse(
      {
        overall: {
          totalRecords: totalDocs,
          recordsLast24Hours: last24HoursDocs,
        },
        monthlyTable: [],
        tableSummary: { totalMonths: 0 },
        pagination: { currentPage: 1, limit: 10, totalMonths: 0, totalPages: 0 },
      },
      'Summary fetched successfully',
      200,
    );
  });
}
