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

import FormSubmission from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createFormSubmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const submissionData = await req.json();
      const newSubmission = await FormSubmission.create(submissionData);

      return formatResponse(newSubmission, 'Form submission created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getFormSubmissionById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const submission = await FormSubmission.findById(id);
    if (!submission) return formatResponse(null, 'Not found', 404);

    return formatResponse(submission, 'Fetched successfully', 200);
  });
}

export async function getFormSubmissions(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');
    const pathTitle = url.searchParams.get('pathTitle');

    const filter: Record<string, unknown> = {};

    if (searchQuery) {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(searchQuery);
      if (isValidObjectId) {
        filter._id = searchQuery;
      }
    }

    if (pathTitle) {
      filter['data.currentPath'] = pathTitle;
    }

    const submissions = await FormSubmission.find(filter as FilterQuery<unknown>)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FormSubmission.countDocuments(filter as FilterQuery<unknown>);

    return formatResponse({ submissions, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateFormSubmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await FormSubmission.findByIdAndUpdate(id, updateData, {
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

export async function deleteFormSubmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await FormSubmission.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
