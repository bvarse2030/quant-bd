/*
|-----------------------------------------
| setting up SocialLinksTab for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { Loader2, Save, Share2 } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ProfileFormData } from './types';

interface SocialLinksTabProps {
  profileFormData: ProfileFormData;
  hasProfileChanges: boolean;
  isUpdatingProfile: boolean;
  onFieldChange: (path: string, value: unknown) => void;
  onUpdateProfile: () => void;
  onResetProfile: () => void;
}

const SocialLinksTab: React.FC<SocialLinksTabProps> = ({
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
          <Share2 className="w-6 h-6" />
          Social Media Links
        </CardTitle>
        <CardDescription className="text-white/60">Connect your social media profiles</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="facebook" className="text-white/70 font-medium">
              Facebook
            </Label>
            <InputFieldForString
              id="facebook"
              placeholder="https://facebook.com/yourprofile"
              value={profileFormData.socialLinks.facebook}
              onChange={value => onFieldChange('socialLinks.facebook', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="twitter" className="text-white/70 font-medium">
              Twitter / X
            </Label>
            <InputFieldForString
              id="twitter"
              placeholder="https://twitter.com/yourhandle"
              value={profileFormData.socialLinks.twitter}
              onChange={value => onFieldChange('socialLinks.twitter', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-white/70 font-medium">
              LinkedIn
            </Label>
            <InputFieldForString
              id="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              value={profileFormData.socialLinks.linkedin}
              onChange={value => onFieldChange('socialLinks.linkedin', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="github" className="text-white/70 font-medium">
              GitHub
            </Label>
            <InputFieldForString
              id="github"
              placeholder="https://github.com/yourusername"
              value={profileFormData.socialLinks.github}
              onChange={value => onFieldChange('socialLinks.github', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-white/70 font-medium">
              Instagram
            </Label>
            <InputFieldForString
              id="instagram"
              placeholder="https://instagram.com/yourusername"
              value={profileFormData.socialLinks.instagram}
              onChange={value => onFieldChange('socialLinks.instagram', value as string)}
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

export default SocialLinksTab;
