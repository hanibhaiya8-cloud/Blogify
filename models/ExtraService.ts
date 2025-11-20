import mongoose, { Document, Schema } from 'mongoose';

export interface IExtraService extends Document {
  name: string;
  rate: string;
  contact: string;
  category: 'standard' | 'vip' | string;
  createdAt: Date;
  updatedAt: Date;
}

const ExtraServiceSchema = new Schema<IExtraService>(
  {
    name: { type: String, required: true },
    rate: { type: String, required: true },
    contact: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const ExtraService = mongoose.models.ExtraService || mongoose.model<IExtraService>('ExtraService', ExtraServiceSchema);

export default ExtraService;
