/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import connectDB from '@/app/api/utils/mongoose';

import Footer from './model';

export const getFooters = async () => {
  await connectDB();
  const footers = await Footer.find({}).sort({ createdAt: -1 }).lean();
  return footers;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFooter = async (data: any) => {
  await connectDB();
  const footer = await Footer.create(data);
  return footer;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateFooter = async (id: string, data: any) => {
  await connectDB();
  const footer = await Footer.findByIdAndUpdate(id, data, { new: true });
  return footer;
};

export const deleteFooter = async (id: string) => {
  await connectDB();
  await Footer.findByIdAndDelete(id);
  return { message: 'Footer deleted' };
};
