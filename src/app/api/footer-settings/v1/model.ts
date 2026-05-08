/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFooter extends Document {
  name: string;
  disabledPaths: { path: string; isExcluded: boolean }[];
  isEnabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const FooterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    disabledPaths: [
      {
        path: { type: String, required: true },
        isExcluded: { type: Boolean, default: true },
      },
    ],
    isEnabled: { type: Boolean, default: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const Footer: Model<IFooter> = mongoose.models.Footer || mongoose.model<IFooter>('Footer', FooterSchema);

export default Footer;
