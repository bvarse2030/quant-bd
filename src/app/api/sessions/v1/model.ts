/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    expiresAt: { type: Date, default: Date.now },
    token: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Session || mongoose.model('Session', sessionSchema, 'session');
