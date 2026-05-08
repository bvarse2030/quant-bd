/*
|-----------------------------------------
| setting up UseFetchSidebar for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { useEffect, useState, useCallback } from 'react';

import { iconMap } from '@/components/all-icons/all-icons';
import { useGetRolesQuery } from '@/redux/features/roles/rolesSlice';
import { useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';

import { defaultDashboardSidebarData, IDefaultSidebarItem } from './default-items';

type APISidebarItem = {
  _id?: string;
  sl_no?: number;
  name: string;
  path: string;
  iconName?: string;
  children?: APISidebarItem[];
};

export const useFetchSidebar = (email: string | null | undefined) => {
  const [sidebarData, setSidebarData] = useState<IDefaultSidebarItem[]>([]);

  const { data: allSidebarsQuery } = useGetSidebarsQuery({ page: 1, limit: 100 });
  const { data: userAccessManagementQuery } = useGetAccessManagementsQuery({ user_email: email ?? '', page: 1, limit: 100 }, { skip: !email });
  const { data: allRolesQuery } = useGetRolesQuery({ page: 1, limit: 100 });

  const convertAPISidebarItemsToIDefaultSidebarItems = useCallback(
    (arr: APISidebarItem[]): IDefaultSidebarItem[] =>
      arr.map(it => ({
        id: it.sl_no ?? 0,
        name: it.name,
        path: it.path,
        icon: iconMap[it.iconName || ''] ?? iconMap['settings'],
        children: it.children ? convertAPISidebarItemsToIDefaultSidebarItems(it.children) : undefined,
      })),
    [],
  );

  useEffect(() => {
    if (!email) {
      setSidebarData(defaultDashboardSidebarData);
      return;
    }

    const apiSidebars = allSidebarsQuery?.data?.sidebars || [];
    const masterSidebarList = convertAPISidebarItemsToIDefaultSidebarItems(apiSidebars);

    const userRoles: string[] = userAccessManagementQuery?.data?.accessManagements?.[0]?.assign_role || [];

    if (!userRoles || userRoles.length === 0) {
      setSidebarData(defaultDashboardSidebarData);
      return;
    }

    type RoleType = { name: string; dashboard_access_ui?: { name: string; path: string }[] };
    const rolesList: RoleType[] = allRolesQuery?.data?.roles || [];

    const matchedRoles: RoleType[] = rolesList.filter(role => userRoles.includes(role.name));

    const allowedUIItems = new Set<string>();
    matchedRoles.forEach(role => {
      role.dashboard_access_ui?.forEach(uiItem => {
        if (uiItem.name && uiItem.path) {
          allowedUIItems.add(`${uiItem.name}||${uiItem.path}`);
        }
      });
    });

    if (allowedUIItems.size === 0) {
      setSidebarData(defaultDashboardSidebarData);
      return;
    }

    const filterSidebarItems = (items: IDefaultSidebarItem[]): IDefaultSidebarItem[] => {
      return items.reduce((acc: IDefaultSidebarItem[], item) => {
        const itemKey = `${item.name}||${item.path}`;

        let isItemAllowed = allowedUIItems.has(itemKey);

        let filteredChildren: IDefaultSidebarItem[] | undefined;
        if (item.children && item.children.length > 0) {
          filteredChildren = filterSidebarItems(item.children);
          if (filteredChildren.length > 0) {
            isItemAllowed = true;
          }
        }

        if (isItemAllowed) {
          acc.push({ ...item, children: filteredChildren });
        }
        return acc;
      }, []);
    };

    const finalFilteredSidebar = filterSidebarItems(masterSidebarList);

    setSidebarData(finalFilteredSidebar.length > 0 ? finalFilteredSidebar : defaultDashboardSidebarData);
  }, [email, allSidebarsQuery, userAccessManagementQuery, allRolesQuery, convertAPISidebarItemsToIDefaultSidebarItems]);

  return [...sidebarData];
};
