/*
|-----------------------------------------
| setting up PersonalInfoTab for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { Loader2, Save, Phone, MapPin, Calendar, Briefcase, Globe } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { SelectField } from '@/components/dashboard-ui/SelectField';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ProfileFormData } from './types';

interface PersonalInfoTabProps {
  profileFormData: ProfileFormData;
  hasProfileChanges: boolean;
  isUpdatingProfile: boolean;
  onFieldChange: (path: string, value: unknown) => void;
  onUpdateProfile: () => void;
  onResetProfile: () => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
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
          <Briefcase className="w-6 h-6" />
          Personal Information
        </CardTitle>
        <CardDescription className="text-white/60">Add more details about yourself</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/70 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <InputFieldForString
              id="phone"
              placeholder="Enter your phone number"
              value={profileFormData.phone}
              onChange={value => onFieldChange('phone', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white/70 font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={profileFormData.bio}
              onChange={e => onFieldChange('bio', e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-white/50">{profileFormData.bio.length}/500 characters</p>
          </div>

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-white/70 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <input
                type="date"
                id="dateOfBirth"
                value={profileFormData.dateOfBirth}
                onChange={e => onFieldChange('dateOfBirth', e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white/70 font-medium">
                Gender
              </Label>
              <SelectField
                options={[
                  { label: 'Prefer not to say', value: 'not_specified' },
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ]}
                value={profileFormData.gender}
                onValueChange={value => onFieldChange('gender', value)}
              />
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-white/70 font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Occupation
            </Label>
            <InputFieldForString
              id="occupation"
              placeholder="Your job title or profession"
              value={profileFormData.occupation}
              onChange={value => onFieldChange('occupation', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-2">
            <Label htmlFor="website" className="text-white/70 font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </Label>
            <InputFieldForString
              id="website"
              placeholder="https://yourwebsite.com"
              value={profileFormData.website}
              onChange={value => onFieldChange('website', value as string)}
            />
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <Label className="text-white/70 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>

            <div className="space-y-4">
              <InputFieldForString
                id="street"
                placeholder="Street address"
                value={profileFormData.address.street}
                onChange={value => onFieldChange('address.street', value as string)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputFieldForString
                  id="city"
                  placeholder="City"
                  value={profileFormData.address.city}
                  onChange={value => onFieldChange('address.city', value as string)}
                />
                <InputFieldForString
                  id="state"
                  placeholder="State/Province"
                  value={profileFormData.address.state}
                  onChange={value => onFieldChange('address.state', value as string)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputFieldForString
                  id="country"
                  placeholder="Country"
                  value={profileFormData.address.country}
                  onChange={value => onFieldChange('address.country', value as string)}
                />
                <InputFieldForString
                  id="zipCode"
                  placeholder="ZIP/Postal code"
                  value={profileFormData.address.zipCode}
                  onChange={value => onFieldChange('address.zipCode', value as string)}
                />
              </div>
            </div>
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

export default PersonalInfoTab;
