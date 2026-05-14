/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import HomeEntry from './model';

export async function createHomeEntry(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const entryData = await req.json();
      const newEntry = await HomeEntry.create(entryData);
      return formatResponse(newEntry, 'Home entry created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getHomeEntryById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Home entry ID is required', 400);

    const entry = await HomeEntry.findById(id);
    if (!entry) return formatResponse(null, 'Home entry not found', 404);

    return formatResponse(entry, 'Home entry fetched successfully', 200);
  });
}

export async function getHomeEntries(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
    const limit = Math.max(parseInt(url.searchParams.get('limit') || '10', 10), 1);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q')?.trim();

    let searchFilter: FilterQuery<unknown> = {};

    if (searchQuery) {
      const orConditions: FilterQuery<unknown>[] = [
        { openDate: { $regex: searchQuery, $options: 'i' } },
        { openTime: { $regex: searchQuery, $options: 'i' } },
        { closeDate: { $regex: searchQuery, $options: 'i' } },
        { closeTime: { $regex: searchQuery, $options: 'i' } },
        { trickNumber: { $regex: searchQuery, $options: 'i' } },
        { 'result.type': { $regex: searchQuery, $options: 'i' } },
      ];

      const numericQuery = parseFloat(searchQuery);
      if (!Number.isNaN(numericQuery)) {
        orConditions.push({ volume: numericQuery }, { entry: numericQuery }, { tp: numericQuery }, { sl: numericQuery }, { 'result.amount': numericQuery });
      }

      searchFilter = { $or: orConditions };
    }

    const entries = await HomeEntry.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await HomeEntry.countDocuments(searchFilter);

    return formatResponse({ entries: entries || [], total, page, limit }, 'Home entries fetched successfully', 200);
  });
}

export async function updateHomeEntry(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'Home entry ID is required', 400);

      const updatedEntry = await HomeEntry.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updatedEntry) return formatResponse(null, 'Home entry not found', 404);

      return formatResponse(updatedEntry, 'Home entry updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function deleteHomeEntry(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'Home entry ID is required', 400);

    const deletedEntry = await HomeEntry.findByIdAndDelete(id);
    if (!deletedEntry) return formatResponse(null, 'Home entry not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Home entry deleted successfully', 200);
  });
}
