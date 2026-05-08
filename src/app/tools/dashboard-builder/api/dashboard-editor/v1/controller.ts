import connectDB from '@/app/api/utils/mongoose';
import DashboardEditor from './model';

export const getDashboardEditors = async () => {
  await connectDB();
  const records = await DashboardEditor.find({}).sort({ createdAt: -1 }).lean();
  return records;
};

export const createDashboardEditor = async (data: Record<string, unknown>) => {
  await connectDB();
  const record = await DashboardEditor.create(data);
  return record;
};

export const updateDashboardEditor = async (id: string, data: Record<string, unknown>) => {
  await connectDB();
  const record = await DashboardEditor.findByIdAndUpdate(id, data, { new: true });
  return record;
};

export const deleteDashboardEditor = async (id: string) => {
  await connectDB();
  await DashboardEditor.findByIdAndDelete(id);
  return { message: 'Record deleted' };
};
