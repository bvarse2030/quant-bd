/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import PWAConfig, { IPWAConfig } from './model';

export const getPWAConfig = async (): Promise<IPWAConfig> => {
  let config = await PWAConfig.findOne();
  if (!config) {
    config = await PWAConfig.create({});
  }
  return config;
};

export const updatePWAConfig = async (data: Partial<IPWAConfig>): Promise<IPWAConfig> => {
  const config = await PWAConfig.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  return config;
};
