/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItem {
  id: number;
  name: string;
  path: string;
  iconName?: string;
  imagePath?: string;
  isImagePublish?: boolean;
  isIconPublish?: boolean;
  children?: IMenuItem[];
}

export interface IMenu extends Document {
  type: string;
  items: IMenuItem[];
}

const MenuItemSchema = new Schema<IMenuItem>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  path: { type: String, required: true },
  imagePath: { type: String, required: true },
  isImagePublish: { type: Boolean, default: false },
  isIconPublish: { type: Boolean, default: false },
  iconName: { type: String },
});

MenuItemSchema.add({
  children: [MenuItemSchema],
});

const MenuSchema = new Schema<IMenu>(
  {
    type: { type: String, required: true, unique: true },
    items: [MenuItemSchema],
  },
  { timestamps: true },
);

let Menu: Model<IMenu>;

try {
  Menu = mongoose.model<IMenu>('Menu');
} catch {
  Menu = mongoose.model<IMenu>('Menu', MenuSchema);
}

export default Menu;
