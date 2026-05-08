/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import BrandSettings, { IBrandSettings } from './model';

const DEFAULT_SETTINGS = {
  brandName: 'AppGenerator',
  logoUrl: null,
  textColor: '#38bdf8',
  fontSize: 'text-2xl',
  fontFamily: 'font-sans',
};

export const getBrandSettings = async () => {
  try {
    const settings = await BrandSettings.findOne().lean();

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return settings;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Error fetching brand settings');
  }
};

export const updateBrandSettings = async (data: Partial<IBrandSettings>) => {
  try {
    const settings = await BrandSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true, runValidators: true });

    return settings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || 'Error updating brand settings');
  }
};
