/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { FilterQuery } from 'mongoose';

import User from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
}

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.mongooseURI!);
  }
}

export async function createUser(req: Request): Promise<IResponse> {
  try {
    await connectDB();
    const userData = await req.json();
    const newUser = await User.create(userData);
    return formatResponse(newUser, 'User created successfully', 201);
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      const err = error as { keyValue?: Record<string, unknown> };
      return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
    }
    throw error;
  }
}

export async function getUserById(req: Request): Promise<IResponse> {
  await connectDB();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return formatResponse(null, 'User ID is required', 400);

  const user = await User.findById(id);
  if (!user) return formatResponse(null, 'User not found', 404);

  return formatResponse(user, 'User fetched successfully', 200);
}

export async function getUsers(req: Request): Promise<IResponse> {
  await connectDB();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const searchQuery = url.searchParams.get('q');

  let filter: FilterQuery<unknown> = {};

  if (searchQuery) {
    filter = {
      $or: [{ name: { $regex: searchQuery, $options: 'i' } }, { email: { $regex: searchQuery, $options: 'i' } }],
    };
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await User.countDocuments(filter);

  return formatResponse({ users, total, page, limit }, 'Users fetched successfully', 200);
}

export async function updateUser(req: Request): Promise<IResponse> {
  await connectDB();
  const { id, ...updateData } = await req.json();

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!updatedUser) return formatResponse(null, 'User not found', 404);

  return formatResponse(updatedUser, 'User updated successfully', 200);
}

export async function deleteUser(req: Request): Promise<IResponse> {
  await connectDB();
  const { id } = await req.json();

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return formatResponse(null, 'User not found', 404);

  return formatResponse({ deletedCount: 1 }, 'User deleted successfully', 200);
}
