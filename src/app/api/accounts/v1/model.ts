/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const accountSchema = new Schema(
  {
    accountId: { type: String },
    providerId: { type: String },
    userId: { type: String },
    accessToken: { type: String },
    idToken: { type: String },
    accessTokenExpiresAt: { type: Date, default: Date.now },
    scope: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Account || mongoose.model('Account', accountSchema, 'account');
