/*
|-----------------------------------------
| setting up MenuWithSession for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';

import connectDB from '@/app/api/utils/mongoose';
import { getMenuData } from '@/app/api/menu-editor/controller';
import { getBrandSettings } from '@/app/api/brand-settings/controller';

import MenuClient from './MenuClient';

const MenuComponentWithSession = async () => {
  await connectDB();
  const rawSettings = await getBrandSettings();
  const rawMenuData = await getMenuData('main-menu');
  const menuItems = rawMenuData?.items || [];
  const brandSettings = JSON.parse(JSON.stringify(rawSettings));
  const serializedMenuItems = JSON.parse(JSON.stringify(menuItems));
  return <MenuClient initialBrandConfig={brandSettings} initialMenuItems={serializedMenuItems} />;
};

export default MenuComponentWithSession;
