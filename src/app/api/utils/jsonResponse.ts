/*
|-----------------------------------------
| setting up JsonResponse for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const ERROR_CODES = {
  SUCCESS: { code: 200, message: 'OK', id: 'S2000' },
  CREATED: { code: 201, message: 'Created successfully', id: 'S2010' },
  UPDATED: { code: 200, message: 'Updated successfully', id: 'S2001' },
  DELETED: { code: 200, message: 'Deleted successfully', id: 'S2002' },

  BAD_REQUEST: { code: 400, message: 'Bad Request — Missing or invalid input', id: 'E4000' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized — Authentication required', id: 'E4010' },
  FORBIDDEN: { code: 403, message: 'Forbidden — Access denied', id: 'E4030' },
  NOT_FOUND: { code: 404, message: 'Resource not found', id: 'E4040' },
  CONFLICT: { code: 409, message: 'Conflict — Already exists', id: 'E4090' },
  UNPROCESSABLE: { code: 422, message: 'Unprocessable Entity — Validation failed', id: 'E4220' },

  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error', id: 'E5000' },
  DATABASE_ERROR: { code: 503, message: 'Database connection failed', id: 'E5030' },
} as const;

export function jsonResponse(key: keyof typeof ERROR_CODES, customMessage?: string, data?: unknown) {
  const { code, message, id } = ERROR_CODES[key];

  return new Response(
    JSON.stringify({
      success: code < 400,
      message: customMessage || message,
      errorCode: id,
      data: data || null,
    }),
    {
      status: code,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
