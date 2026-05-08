/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';

import AccessManagement from './model';
import { IResponse } from '../../utils/utils';

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

export async function createAccessManagement(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const accessManagementData = await req.json();
      const newAccessManagement = await AccessManagement.create({
        ...accessManagementData,
      });
      return formatResponse(newAccessManagement, 'AccessManagement created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getAccessManagementById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'AccessManagement ID is required', 400);

    const accessManagement = await AccessManagement.findById(id);
    if (!accessManagement) return formatResponse(null, 'AccessManagement not found', 404);

    return formatResponse(accessManagement, 'AccessManagement fetched successfully', 200);
  });
}

export async function getAccessManagements(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    const searchQueryByEmail = url.searchParams.get('user_email');

    let searchFilter: FilterQuery<unknown> = {};

    if (searchQueryByEmail) {
      searchFilter = { user_email: searchQueryByEmail };
    } else if (searchQuery) {
      if (searchQuery.startsWith('createdAt:range:')) {
        const datePart = searchQuery.split(':')[2];
        const [startDateString, endDateString] = datePart.split('_');

        if (startDateString && endDateString) {
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);

          endDate.setUTCHours(23, 59, 59, 999);

          searchFilter = {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          };
        }
      } else {
        const orConditions: FilterQuery<unknown>[] = [];

        const stringFields = ['user_name', 'user_email', 'given_by_email'];
        stringFields.forEach(field => {
          orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
        });

        const numericQuery = parseFloat(searchQuery);
        if (!isNaN(numericQuery)) {
          const numberFields: string[] = [];
          numberFields.forEach(field => {
            orConditions.push({ [field]: numericQuery });
          });
        }

        if (orConditions.length > 0) {
          searchFilter = { $or: orConditions };
        }
      }
    }

    const accessManagements = await AccessManagement.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const totalAccessManagements = await AccessManagement.countDocuments(searchFilter);

    return formatResponse(
      {
        accessManagements: accessManagements || [],
        total: totalAccessManagements,
        page,
        limit,
      },
      'AccessManagements fetched successfully',
      200,
    );
  });
}

export async function updateAccessManagement(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedAccessManagement = await AccessManagement.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedAccessManagement) return formatResponse(null, 'AccessManagement not found', 404);
      return formatResponse(updatedAccessManagement, 'AccessManagement updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function bulkUpdateAccessManagements(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }) =>
        AccessManagement.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);

    const failedUpdates = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteAccessManagement(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedAccessManagement = await AccessManagement.findByIdAndDelete(id);
    if (!deletedAccessManagement) return formatResponse(null, 'AccessManagement not found', 404);
    return formatResponse({ deletedCount: 1 }, 'AccessManagement deleted successfully', 200);
  });
}

export async function bulkDeleteAccessManagements(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await AccessManagement.findById(id);
        if (doc) {
          const deletedDoc = await AccessManagement.findByIdAndDelete(id);
          if (deletedDoc) {
            deletedIds.push(id);
          }
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
