/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface ICURD {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const defaultCURD = {
  create: true,
  read: true,
  update: false,
  delete: false,
};

export interface IRoles {
  name: string;
  email: string;
  note: string;
  description: string;
  dashboard_access_ui?: { name: string; path: string; userAccess: ICURD }[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export const defaultRoles = {
  name: '',
  email: '',
  dashboard_access_ui: [],
  note: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
