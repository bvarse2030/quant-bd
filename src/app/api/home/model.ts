/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const homeEntrySchema = new Schema(
  {
    openDate: { type: String, required: true },
    openTime: { type: String, required: true },
    closeDate: { type: String, default: '' },
    closeTime: { type: String, default: '' },
    volume: { type: Number, default: 0.01 },
    entry: { type: Number, default: 0 },
    tp: { type: Number, default: 0 },
    sl: { type: Number, default: 0 },
    result: {
      type: {
        type: String,
        enum: ['Profit', 'Loss'],
        default: 'Profit',
      },
      amount: { type: Number, default: 0 },
    },
    isPlaced: { type: Boolean, default: false },
    trickNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default mongoose.models.HomeEntry || mongoose.model('HomeEntry', homeEntrySchema, 'home_entries');
