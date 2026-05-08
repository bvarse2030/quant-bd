/*
|-----------------------------------------
| setting up TypeUtils for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ApiErrorDataPayload {
  data: null;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  status: number;
  data: ApiErrorDataPayload;
}
