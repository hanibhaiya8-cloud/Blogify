import mongoose, { Document, Schema } from 'mongoose';

export interface IHighProfileCallGirl extends Document {
  heading: string;
  description: string;
  location: string;
  contactNumber: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HighProfileCallGirlSchema = new Schema<IHighProfileCallGirl>(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Create the model or use existing one to prevent recompilation errors
const HighProfileCallGirl = mongoose.models.HighProfileCallGirl || mongoose.model<IHighProfileCallGirl>('HighProfileCallGirl', HighProfileCallGirlSchema);

export default HighProfileCallGirl;
