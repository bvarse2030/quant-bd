/*
|-----------------------------------------
| setting up AccountTab for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { Loader2, Save, User2, Mail, CheckCircle2, XCircle } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { UserFormData } from './types';

interface AccountTabProps {
  userFormData: UserFormData;
  hasUserChanges: boolean;
  isUpdatingUser: boolean;
  onFieldChange: (name: string, value: unknown) => void;
  onUpdateUser: () => void;
  onResetUser: () => void;
  userData?: { data: { createdAt: Date; updatedAt: Date } };
  userId?: string;
}

const AccountTab: React.FC<AccountTabProps> = ({
  userFormData,
  hasUserChanges,
  isUpdatingUser,
  onFieldChange,
  onUpdateUser,
  onResetUser,
  userData,
  userId,
}) => {
  return (
    <>
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-semibold tracking-wide text-white/90 flex items-center gap-2">
            <User2 className="w-6 h-6" />
            Account Information
          </CardTitle>
          <CardDescription className="text-white/60">Update your basic account details</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70 font-medium flex items-center gap-2">
                <User2 className="w-4 h-4" />
                Name
              </Label>
              <InputFieldForString
                id="name"
                placeholder="Enter your name"
                value={userFormData.name}
                onChange={value => onFieldChange('name', value as string)}
              />
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <InputFieldForEmail id="email" readonly={true} value={userFormData.email} onChange={value => onFieldChange('email', value as string)} />
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-2">
              <Label className="text-white/70 font-medium flex items-center gap-2">
                {userFormData.emailVerified ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-orange-400" />}
                Email Verification Status
              </Label>
              <div className="flex items-center gap-2">
                {userFormData.emailVerified ? (
                  <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-400/30">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                    Not Verified
                  </Badge>
                )}
                {!userFormData.emailVerified && <p className="text-xs text-white/50">Check your email for verification link</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={onUpdateUser} disabled={!hasUserChanges || isUpdatingUser} variant="outlineWater" className="flex-1 sm:flex-initial">
                {isUpdatingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              {hasUserChanges && (
                <Button onClick={onResetUser} disabled={isUpdatingUser} variant="outlineDefault" className="flex-1 sm:flex-initial">
                  Reset
                </Button>
              )}
            </div>

            {hasUserChanges && (
              <div className="flex items-center gap-2 text-sm text-yellow-300/70 bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3">
                <span className="font-medium">⚠</span>
                <span>You have unsaved changes</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white/80">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">User ID:</span>
            <span className="text-white/90 font-mono text-xs">{userId}</span>
          </div>
          {userData?.data?.createdAt && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Member since:</span>
              <span className="text-white/90">{new Date(userData.data.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          {userData?.data?.updatedAt && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Last updated:</span>
              <span className="text-white/90">{new Date(userData.data.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AccountTab;
