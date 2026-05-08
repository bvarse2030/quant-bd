/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface IAccessManagements {
  user_name: string;
  user_email: string;
  assign_role: string[];
  given_by_email: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultAccessManagements = {
  user_name: '',
  user_email: '',
  assign_role: [],
  given_by_email: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
