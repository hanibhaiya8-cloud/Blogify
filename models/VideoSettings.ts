import mongoose from 'mongoose';

interface IVideoSettings extends mongoose.Document {
  videoUrl: string;
  phoneNumber: string;
  updatedAt: Date;
}

interface VideoSettingsModel extends mongoose.Model<IVideoSettings> {
  getSettings(): Promise<IVideoSettings>;
}

const VideoSettingsSchema = new mongoose.Schema<IVideoSettings, VideoSettingsModel>({
  videoUrl: {
    type: String,
    required: false,
    default: ''
  },
  phoneNumber: {
    type: String,
    required: true,
    default: '917878787878'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one document exists
VideoSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      videoUrl: '',
      phoneNumber: '917878787878'
    });
  }
  return settings;
};

const VideoSettings = (mongoose.models.VideoSettings as VideoSettingsModel) || 
  mongoose.model<IVideoSettings, VideoSettingsModel>('VideoSettings', VideoSettingsSchema);

export default VideoSettings;
