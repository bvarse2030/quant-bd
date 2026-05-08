/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { NextResponse } from 'next/server';

import connectToDB from '@/app/api/utils/mongoose';

import Menu from './model';

const formatResponse = (data: unknown, message: string, status: number = 200) => {
  return NextResponse.json(
    {
      data,
      message,
      status,
    },
    { status },
  );
};

import { unstable_cache, revalidateTag } from 'next/cache';

export const getMenuData = unstable_cache(
  async (type: string = 'main-menu') => {
    await connectToDB();
    const menu = await Menu.findOne({ type }).lean();
    return menu ? JSON.parse(JSON.stringify(menu)) : null;
  },
  ['menu-data'],
  { tags: ['menu'] },
);

export async function getMenu(type: string = 'main-menu') {
  try {
    const menu = await getMenuData(type);

    if (!menu) {
      return formatResponse({ items: [] }, 'Menu not found', 404);
    }

    return formatResponse(menu, 'Menu fetched successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    return formatResponse(null, error.message || 'Internal Server Error', 500);
  }
}

export async function updateMenu(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();
    const { type = 'main-menu', items } = body;
    if (!items || !Array.isArray(items)) {
      return formatResponse(null, 'Invalid items format', 400);
    }

    const updatedMenu = await Menu.findOneAndUpdate({ type }, { items }, { new: true, upsert: true });

    revalidateTag('menu');

    return formatResponse(updatedMenu, 'Menu updated successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating menu:', error);
    return formatResponse(null, error.message || 'Internal Server Error', 500);
  }
}
