/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IButtonConfig {
  text: string;
  bgColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  animation: 'none' | 'pulse' | 'bounce' | 'ping';
}

export interface IPWAConfig extends Document {
  isEnabled: boolean;
  title: string;
  description: string;
  installBtn: IButtonConfig;
  laterBtn: IButtonConfig;
}

const ButtonSchema = new Schema({
  text: { type: String, default: 'Install' },
  bgColor: { type: String, default: '#4F46E5' },
  textColor: { type: String, default: '#FFFFFF' },
  size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  animation: { type: String, enum: ['none', 'pulse', 'bounce', 'ping'], default: 'none' },
});

const PWAConfigSchema = new Schema<IPWAConfig>(
  {
    isEnabled: { type: Boolean, default: true },
    title: { type: String, default: 'Install Application' },
    description: { type: String, default: 'Add to home screen for the best experience.' },
    installBtn: { type: ButtonSchema, default: () => ({}) },
    laterBtn: { type: ButtonSchema, default: () => ({ text: 'Maybe Later', bgColor: 'transparent', textColor: '#9CA3AF' }) },
  },
  { timestamps: true },
);

const PWAConfig: Model<IPWAConfig> = mongoose.models.PWAConfig || mongoose.model<IPWAConfig>('PWAConfig', PWAConfigSchema);

export default PWAConfig;
