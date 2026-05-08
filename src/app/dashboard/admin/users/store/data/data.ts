/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IUsers {
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultUsers = {
  name: '',
  email: '',
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
