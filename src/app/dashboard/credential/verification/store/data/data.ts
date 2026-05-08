/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IVerifications {
  identifier: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export const defaultVerifications: IVerifications = {
  identifier: '',
  value: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
