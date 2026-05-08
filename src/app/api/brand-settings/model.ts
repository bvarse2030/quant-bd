/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrandSettings extends Document {
  brandName: string;
  logoUrl: string | null;
  textColor: string;
  fontSize: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  menuTextColor: string;
  menuFontSize: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
  menuFontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  menuBackgroundColor: string;
  backgroundTransparent: number;
  menuSticky: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSettingsSchema: Schema = new Schema(
  {
    brandName: {
      type: String,
      required: [true, 'Brand name is required'],
      default: 'Aether Digital',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    textColor: {
      type: String,
      default: '#f8fafc',
    },
    fontSize: {
      type: String,
      enum: ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'],
      default: 'text-2xl',
    },
    fontFamily: {
      type: String,
      enum: ['font-sans', 'font-serif', 'font-mono'],
      default: 'font-sans',
    },
    menuTextColor: {
      type: String,
      default: '#94a3b8',
    },
    menuFontSize: {
      type: String,
      enum: ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'],
      default: 'text-lg',
    },
    menuFontFamily: {
      type: String,
      enum: ['font-sans', 'font-serif', 'font-mono'],
      default: 'font-sans',
    },
    menuBackgroundColor: {
      type: String,
      default: '#0f172a',
    },
    menuSticky: {
      type: Boolean,
      default: true,
    },
    backgroundTransparent: Number,
  },
  {
    timestamps: true,
  },
);
const BrandSettings: Model<IBrandSettings> = mongoose.models.BrandSettings || mongoose.model<IBrandSettings>('BrandSettings', BrandSettingsSchema);

export default BrandSettings;
