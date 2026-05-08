import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDashboardEditor extends Document {
  Name: string;
  Roll: number;
  class: number;
  subject: string[];
  payment: { key: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const DashboardEditorSchema: Schema = new Schema(
  {
    Name: { type: String, required: true },
    Roll: { type: Number, required: true },
    class: { type: Number, required: true },
    subject: [{ type: String }],
    payment: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const DashboardEditor: Model<IDashboardEditor> = mongoose.models.DashboardEditor || mongoose.model<IDashboardEditor>('DashboardEditor', DashboardEditorSchema);

export default DashboardEditor;
