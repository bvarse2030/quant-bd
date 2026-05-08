/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    delete_url: {
      type: String,
      trim: true,
    },
    display_url: {
      type: String,
      trim: true,
    },
    uploaderPlace: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    author_email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'trash'],
      default: 'active',
    },
    contentType: {
      type: String,
      enum: ['video', 'image', 'pdf', 'docx', 'audio'],
      default: 'image',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);
