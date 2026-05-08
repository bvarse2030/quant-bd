/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';

import Sidebar from './model';
import { IResponse } from '../../utils/utils';

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

export async function createSidebar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const sidebarData = await req.json();
      const newSidebar = await Sidebar.create({
        ...sidebarData,
      });
      return formatResponse(newSidebar, 'Sidebar created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getSidebarById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Sidebar ID is required', 400);

    const sidebar = await Sidebar.findById(id);
    if (!sidebar) return formatResponse(null, 'Sidebar not found', 404);

    return formatResponse(sidebar, 'Sidebar fetched successfully', 200);
  });
}

export async function getSidebars(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');

    let searchFilter: FilterQuery<unknown> = {};

    if (searchQuery) {
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
        const stringFields = ['name', 'path', 'iconName'];
        stringFields.forEach(field => {
          orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
        });

        const numericQuery = parseFloat(searchQuery);
        if (!isNaN(numericQuery)) {
          orConditions.push({ sl_no: numericQuery });
        }

        if (orConditions.length > 0) {
          searchFilter = { $or: orConditions };
        }
      }
    }

    const sidebars = await Sidebar.find(searchFilter).sort({ sl_no: 1 }).skip(skip).limit(limit);
    const totalSidebars = await Sidebar.countDocuments(searchFilter);

    return formatResponse(
      {
        sidebars: sidebars || [],
        total: totalSidebars,
        page,
        limit,
      },
      'Sidebars fetched successfully',
      200,
    );
  });
}

export async function updateSidebar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedSidebar = await Sidebar.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedSidebar) return formatResponse(null, 'Sidebar not found', 404);
      return formatResponse(updatedSidebar, 'Sidebar updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function bulkUpdateSidebars(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }) =>
        Sidebar.findByIdAndUpdate(id, updateData, {
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

export async function deleteSidebar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedSidebar = await Sidebar.findByIdAndDelete(id);
    if (!deletedSidebar) return formatResponse(null, 'Sidebar not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Sidebar deleted successfully', 200);
  });
}

export async function bulkDeleteSidebars(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await Sidebar.findById(id);
        if (doc) {
          const deletedDoc = await Sidebar.findByIdAndDelete(id);
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
