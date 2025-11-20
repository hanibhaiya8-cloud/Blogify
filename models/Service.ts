import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  service: string;
  duration: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    service: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
