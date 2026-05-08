/*
|-----------------------------------------
| setting up Utils for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { toast } from 'react-toastify';

import { ApiErrorResponse } from './TypeUtils';

export const handleSuccess = (message: string) => {
  toast.success(message, {
    toastId: (Math.random() * 1000).toFixed(0),
    position: 'top-center',
  });
};

export const handleError = (str: string) => {
  toast.error(str, {
    toastId: (Math.random() * 1000).toFixed(0),
    position: 'top-center',
  });
};

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as ApiErrorResponse).status === 'number' &&
    'data' in error &&
    typeof (error as ApiErrorResponse).data === 'object' &&
    (error as ApiErrorResponse).data !== null &&
    'message' in (error as ApiErrorResponse).data &&
    typeof (error as ApiErrorResponse).data.message === 'string' &&
    'status' in (error as ApiErrorResponse).data &&
    typeof (error as ApiErrorResponse).data.status === 'number'
  );
}

export function formatDuplicateKeyError(errorString: string) {
  const jsonMatch = errorString.match(/{.*}/);

  if (!jsonMatch || !jsonMatch[0]) {
    console.warn('Could not find JSON part in error string:', errorString);
    return errorString || 'Please check your input.';
  }

  const jsonString = jsonMatch[0];
  let parsedData;

  try {
    parsedData = JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON from error string:', jsonString, e);
    return 'Error processing duplicate key information. The data might be malformed.';
  }
  const keys = Object.keys(parsedData);

  if (keys.length === 0) {
    console.warn('No key found in parsed duplicate error data:', parsedData);
    return 'A duplicate entry error occurred, but the specific field is unknown.';
  }
  const keyName = keys[0];
  const keyValue = parsedData[keyName];

  return `Please change ${keyName} "${String(keyValue)}" already exist.`;
}
