import mongoose, { Document, Schema } from 'mongoose';

export interface IFinalCallGirl extends Document {
  name: string;
  rate: string;
  whatsapp: string;
  createdAt: Date;
  updatedAt: Date;
}

const FinalCallGirlSchema = new Schema<IFinalCallGirl>(
  {
    name: { type: String, required: true },
    rate: { type: String, required: true },
    whatsapp: { type: String, required: true },
  },
  { timestamps: true }
);

const FinalCallGirl = mongoose.models.FinalCallGirl || mongoose.model<IFinalCallGirl>('FinalCallGirl', FinalCallGirlSchema);

export default FinalCallGirl;
