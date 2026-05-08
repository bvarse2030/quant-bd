/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const childItemSchema = new Schema(
  {
    sl_no: { type: Number, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    iconName: { type: String, default: 'Menu' },
  },
  { _id: false },
);

const sidebarSchema = new Schema(
  {
    sl_no: { type: Number, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    iconName: { type: String, default: 'Menu' },
    children: [childItemSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Sidebar || mongoose.model('Sidebar', sidebarSchema);
