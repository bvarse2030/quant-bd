/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const verificationSchema = new Schema(
  {
    identifier: { type: String },
    value: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Verification || mongoose.model('Verification', verificationSchema, 'verification');
