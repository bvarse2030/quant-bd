/*
|-----------------------------------------
| setting up PreferencesTab for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { Loader2, Save, Settings, Heart } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ProfileFormData } from './types';

interface PreferencesTabProps {
  profileFormData: ProfileFormData;
  hasProfileChanges: boolean;
  isUpdatingProfile: boolean;
  onFieldChange: (path: string, value: unknown) => void;
  onUpdateProfile: () => void;
  onResetProfile: () => void;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  profileFormData,
  hasProfileChanges,
  isUpdatingProfile,
  onFieldChange,
  onUpdateProfile,
  onResetProfile,
}) => {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-xl font-semibold tracking-wide text-white/90 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Preferences
        </CardTitle>
        <CardDescription className="text-white/60">Manage your account preferences</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-white/70 font-medium">
              Theme
            </Label>
            <Select value={profileFormData.preferences.theme} onValueChange={value => onFieldChange('preferences.theme', value)}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-white/70 font-medium">
                Enable Notifications
              </Label>
              <p className="text-sm text-white/50">Receive notifications about your account</p>
            </div>
            <input
              type="checkbox"
              id="notifications"
              checked={profileFormData.preferences.notifications}
              onChange={e => onFieldChange('preferences.notifications', e.target.checked)}
              className="h-5 w-5"
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter" className="text-white/70 font-medium flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Subscribe to Newsletter
              </Label>
              <p className="text-sm text-white/50">Get updates and news via email</p>
            </div>
            <input
              type="checkbox"
              id="newsletter"
              checked={profileFormData.preferences.newsletter}
              onChange={e => onFieldChange('preferences.newsletter', e.target.checked)}
              className="h-5 w-5"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onUpdateProfile} disabled={!hasProfileChanges || isUpdatingProfile} variant="outlineWater" className="flex-1 sm:flex-initial">
              {isUpdatingProfile ? (
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

            {hasProfileChanges && (
              <Button onClick={onResetProfile} disabled={isUpdatingProfile} variant="outlineDefault" className="flex-1 sm:flex-initial">
                Reset
              </Button>
            )}
          </div>

          {hasProfileChanges && (
            <div className="flex items-center gap-2 text-sm text-yellow-300/70 bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3">
              <span className="font-medium">⚠</span>
              <span>You have unsaved changes</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
