/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const roleSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    note: { type: String, default: '' },
    description: { type: String, default: '' },
    dashboard_access_ui: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
        userAccess: {
          create: { type: Boolean, required: true },
          read: { type: Boolean, required: true },
          update: { type: Boolean, required: true },
          delete: { type: Boolean, required: true },
        },
        _id: false,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Role || mongoose.model('Role', roleSchema);
