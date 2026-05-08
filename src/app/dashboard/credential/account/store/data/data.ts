/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IAccounts {
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string;
  idToken: string;
  accessTokenExpiresAt: Date;
  scope: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export const defaultAccounts = {
  accountId: '',
  providerId: '',
  userId: '',
  accessToken: '',
  idToken: '',
  accessTokenExpiresAt: new Date(),
  scope: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
