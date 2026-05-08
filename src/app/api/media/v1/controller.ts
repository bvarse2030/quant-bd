/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FilterQuery } from 'mongoose';
import { UTApi } from 'uploadthing/server';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Media from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const mediaData = await req.json();
      const newMidia = await Media.create(mediaData);
      return formatResponse(newMidia, 'Media created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getMediaById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const media = await Media.findById(id);
    if (!media) return formatResponse(null, 'Not found', 404);
    return formatResponse(media, 'Fetched successfully', 200);
  });
}

export async function getMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');
    const contentType = url.searchParams.get('contentType');
    const status = url.searchParams.get('status') || 'active';

    const filter: FilterQuery<unknown> = { status };

    if (contentType && contentType !== 'all') {
      filter.contentType = contentType;
    }

    if (searchQuery) {
      filter.$and = [
        { status },
        ...(contentType && contentType !== 'all' ? [{ contentType }] : []),
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { url: { $regex: searchQuery, $options: 'i' } },
            { display_url: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      ];
    }

    const data = await Media.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Media.countDocuments(filter);

    return formatResponse({ data, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Media.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: false,
      });
      if (!updated) return formatResponse(null, 'Not found', 404);
      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteMedia(req: Request): Promise<IResponse> {
  const getFileKeyFromUrl = (url: string) => {
    if (!url) return null;
    try {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1] || null;
    } catch {
      return null;
    }
  };

  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const media = await Media.findById(id);
    if (!media) return formatResponse(null, 'Not found', 404);

    if (media.uploaderPlace !== 'youtube') {
      const utapi = new UTApi();
      const fileKey = getFileKeyFromUrl(media.url);
      try {
        if (fileKey) {
          await utapi.deleteFiles(fileKey);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return formatResponse({ deletedCount: 0 }, 'Failed to delete storage file', 500);
      }
    }

    const deleted = await Media.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
