/*
|-----------------------------------------
| setting up IsUserHasAccessByRole for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import connectDB from '@/app/api/utils/mongoose';

import Role from '../roles/v1/model';
import AccessManagement from '../accessManagements/v1/model';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface IWantAccess {
  db_name: string;
  access: PermissionAction;
}

interface IUserAccess {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface IDashboardAccessUI {
  name: string;
  path: string;
  userAccess: IUserAccess;
}

interface IRoleDocument {
  _id: string;
  name: string;
  dashboard_access_ui: IDashboardAccessUI[];
}

const getRoleNamesByEmail = async (email: string): Promise<string[]> => {
  await connectDB();
  const accessManagement = await AccessManagement.findOne({ user_email: email });

  if (!accessManagement) return [];
  return accessManagement.assign_role;
};

const getRolePermissions = async (roleName: string): Promise<IDashboardAccessUI[] | null> => {
  await connectDB();
  const roleData = (await Role.findOne({ name: roleName }).lean()) as IRoleDocument | null;

  return roleData ? roleData.dashboard_access_ui : null;
};

export const isUserHasAccessByRole = async (arg: IWantAccess): Promise<NextResponse | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ data: null, message: 'Session required', status: 401 }, { status: 401 });
  }

  const userRoles = await getRoleNamesByEmail(email);
  if (userRoles.length === 0) {
    return NextResponse.json({ data: null, message: 'Access denied: No roles assigned', status: 403 }, { status: 403 });
  }

  for (const roleName of userRoles) {
    const dashboardAccess = await getRolePermissions(roleName);

    if (!dashboardAccess) continue;

    const moduleAccess = dashboardAccess.find(item => item.name.toLowerCase() === arg.db_name.toLowerCase());

    if (moduleAccess && moduleAccess.userAccess[arg.access] === true) {
      return null;
    }
  }

  return NextResponse.json({ data: null, message: `Access denied: Insufficient permissions for ${arg.db_name}`, status: 403 }, { status: 403 });
};
