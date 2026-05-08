/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useSession } from '@/lib/auth-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateUsersMutation, useGetUsersByIdQuery } from '@/redux/features/user/userSlice';
import { useGetProfileByUserIdQuery, useUpdateProfileMutation } from '@/redux/features/profile/profileSlice';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from '@/app/dashboard/admin/users/components/utils';

import AccountTab from './components/AccountTab';
// import SocialLinksTab from './components/SocialLinksTab';
// import PreferencesTab from './components/PreferencesTab';
import PersonalInfoTab from './components/PersonalInfoTab';
import { UserFormData, ProfileFormData } from './components/types';

const ProfilePage: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  const [updateUsers, { isLoading: isUpdatingUser }] = useUpdateUsersMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    emailVerified: false,
  });

  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    phone: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    dateOfBirth: '',
    gender: 'not_specified',
    occupation: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      github: '',
      instagram: '',
    },
    preferences: {
      newsletter: false,
      notifications: true,
      theme: 'system',
    },
  });

  const [hasUserChanges, setHasUserChanges] = useState(false);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [initialUserData, setInitialUserData] = useState<UserFormData>({
    name: '',
    email: '',
    emailVerified: false,
  });
  const [initialProfileData, setInitialProfileData] = useState<ProfileFormData>({
    phone: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    dateOfBirth: '',
    gender: 'not_specified',
    occupation: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      github: '',
      instagram: '',
    },
    preferences: {
      newsletter: false,
      notifications: true,
      theme: 'system',
    },
  });

  const userId = session?.data?.user?.id;

  const { data: userData, isLoading: isFetchingUser } = useGetUsersByIdQuery(userId, {
    skip: !userId,
  });

  const { data: profileData, isLoading: isFetchingProfile } = useGetProfileByUserIdQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (!session?.data?.session && !session?.isPending) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      const data = {
        name: user.name || '',
        email: user.email || '',
        emailVerified: user.emailVerified || false,
      };
      setUserFormData(data);
      setInitialUserData(data);
    }
  }, [userData]);

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      const data = {
        phone: profile.phone || '',
        bio: profile.bio || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          country: profile.address?.country || '',
          zipCode: profile.address?.zipCode || '',
        },
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || 'not_specified',
        occupation: profile.occupation || '',
        website: profile.website || '',
        socialLinks: {
          facebook: profile.socialLinks?.facebook || '',
          twitter: profile.socialLinks?.twitter || '',
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          instagram: profile.socialLinks?.instagram || '',
        },
        preferences: {
          newsletter: profile.preferences?.newsletter || false,
          notifications: profile.preferences?.notifications !== false,
          theme: profile.preferences?.theme || 'system',
        },
      };
      setProfileFormData(data);
      setInitialProfileData(data);
    }
  }, [profileData]);

  const handleUserFieldChange = (name: string, value: unknown) => {
    setUserFormData(prev => {
      const updated = { ...prev, [name]: value };
      setHasUserChanges(JSON.stringify(updated) !== JSON.stringify(initialUserData));
      return updated;
    });
  };

  const handleProfileFieldChange = (path: string, value: unknown) => {
    setProfileFormData(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current: Record<string, unknown> = updated as Record<string, unknown>;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] === 'object' && current[key] !== null) {
          current = current[key] as Record<string, unknown>;
        }
      }
      current[keys[keys.length - 1]] = value;

      setHasProfileChanges(JSON.stringify(updated) !== JSON.stringify(initialProfileData));
      return updated;
    });
  };

  const handleUpdateUser = async () => {
    if (!userId) {
      handleError('User ID not found');
      return;
    }

    try {
      await updateUsers({
        id: userId,
        name: userFormData.name,
        email: userFormData.email,
      }).unwrap();

      setInitialUserData(userFormData);
      setHasUserChanges(false);
      handleSuccess('User information updated successfully');
    } catch (error: unknown) {
      console.error('Failed to update user:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      handleError('User ID not found');
      return;
    }

    try {
      await updateProfile({
        userId,
        ...profileFormData,
      }).unwrap();

      setInitialProfileData(profileFormData);
      setHasProfileChanges(false);
      handleSuccess('Profile updated successfully');
    } catch (error: unknown) {
      console.error('Failed to update profile:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = error.data?.message || 'An API error occurred.';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  const handleResetUser = () => {
    setUserFormData(initialUserData);
    setHasUserChanges(false);
  };

  const handleResetProfile = () => {
    setProfileFormData(initialProfileData);
    setHasProfileChanges(false);
  };

  if (session?.isPending || isFetchingUser || isFetchingProfile) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-white/70" />
          <p className="text-white/70 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.data?.session) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="h2 text-white/90 mb-2">Profile Settings</h1>
        <p className="text-white/60">Manage your account information and preferences</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          {/* <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
        </TabsList>

        <TabsContent value="account">
          <AccountTab
            userFormData={userFormData}
            hasUserChanges={hasUserChanges}
            isUpdatingUser={isUpdatingUser}
            onFieldChange={handleUserFieldChange}
            onUpdateUser={handleUpdateUser}
            onResetUser={handleResetUser}
            userData={userData}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="personal">
          <PersonalInfoTab
            profileFormData={profileFormData}
            hasProfileChanges={hasProfileChanges}
            isUpdatingProfile={isUpdatingProfile}
            onFieldChange={handleProfileFieldChange}
            onUpdateProfile={handleUpdateProfile}
            onResetProfile={handleResetProfile}
          />
        </TabsContent>

        {/* <TabsContent value="social">
          <SocialLinksTab
            profileFormData={profileFormData}
            hasProfileChanges={hasProfileChanges}
            isUpdatingProfile={isUpdatingProfile}
            onFieldChange={handleProfileFieldChange}
            onUpdateProfile={handleUpdateProfile}
            onResetProfile={handleResetProfile}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            profileFormData={profileFormData}
            hasProfileChanges={hasProfileChanges}
            isUpdatingProfile={isUpdatingProfile}
            onFieldChange={handleProfileFieldChange}
            onUpdateProfile={handleUpdateProfile}
            onResetProfile={handleResetProfile}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default ProfilePage;
