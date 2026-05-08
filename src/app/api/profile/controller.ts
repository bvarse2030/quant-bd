/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose from 'mongoose';
import Profile from './model';

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

// CREATE Profile
export async function createProfile(req: Request): Promise<IResponse> {
  try {
    await connectDB();
    const profileData = await req.json();

    const existingProfile = await Profile.findOne({ userId: profileData.userId });
    if (existingProfile) {
      return formatResponse(null, 'Profile already exists for this user', 400);
    }

    const newProfile = await Profile.create(profileData);
    return formatResponse(newProfile, 'Profile created successfully', 201);
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      const err = error as { keyValue?: Record<string, unknown> };
      return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
    }
    throw error;
  }
}

export async function getProfileByUserId(req: Request): Promise<IResponse> {
  await connectDB();
  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) return formatResponse(null, 'User ID is required', 400);

  const profile = await Profile.findOne({ userId });
  if (!profile) {
    return formatResponse(
      {
        userId,
        phone: '',
        bio: '',
        address: { street: '', city: '', state: '', country: '', zipCode: '' },
        dateOfBirth: null,
        gender: '',
        occupation: '',
        website: '',
        socialLinks: { facebook: '', twitter: '', linkedin: '', github: '', instagram: '' },
        preferences: { newsletter: false, notifications: true, theme: 'system' },
      },
      'No profile found, returning default',
      200,
    );
  }

  return formatResponse(profile, 'Profile fetched successfully', 200);
}

export async function getProfileById(req: Request): Promise<IResponse> {
  await connectDB();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return formatResponse(null, 'Profile ID is required', 400);

  const profile = await Profile.findById(id);
  if (!profile) return formatResponse(null, 'Profile not found', 404);

  return formatResponse(profile, 'Profile fetched successfully', 200);
}

export async function updateProfile(req: Request): Promise<IResponse> {
  await connectDB();
  const { userId, ...updateData } = await req.json();

  if (!userId) return formatResponse(null, 'User ID is required', 400);

  let updatedProfile = await Profile.findOneAndUpdate({ userId }, { $set: updateData }, { new: true, runValidators: true });

  if (!updatedProfile) {
    updatedProfile = await Profile.create({ userId, ...updateData });
    return formatResponse(updatedProfile, 'Profile created successfully', 201);
  }

  return formatResponse(updatedProfile, 'Profile updated successfully', 200);
}

export async function deleteProfile(req: Request): Promise<IResponse> {
  await connectDB();
  const { userId } = await req.json();

  if (!userId) return formatResponse(null, 'User ID is required', 400);

  const deletedProfile = await Profile.findOneAndDelete({ userId });
  if (!deletedProfile) return formatResponse(null, 'Profile not found', 404);

  return formatResponse({ deletedCount: 1 }, 'Profile deleted successfully', 200);
}
