/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

import { getFormSubmissions, createFormSubmission, updateFormSubmission, deleteFormSubmission, getFormSubmissionById } from './controller';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getFormSubmissionById(req) : await getFormSubmissions(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const result = await createFormSubmission(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const result = await updateFormSubmission(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const result = await deleteFormSubmission(req);

  return formatResponse(result.data, result.message, result.status);
}
