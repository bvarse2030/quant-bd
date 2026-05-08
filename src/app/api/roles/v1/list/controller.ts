/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import Role from '../model';

import { withDB } from '@/app/api/utils/db';
import { IResponse } from '@/app/api/utils/utils';

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRoleNames(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const roles = await Role.find({}, { _id: 1, name: 1 }).sort({ createdAt: -1 });

      const simplified = roles.map((r: { _id: string; name: string }) => ({
        id: r._id.toString(),
        name: r.name,
      }));

      return formatResponse(simplified, 'Role names fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching role names:', error);
      return formatResponse(null, 'Failed to fetch role names', 500);
    }
  });
}
