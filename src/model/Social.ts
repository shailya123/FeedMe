import mongoose, { Schema, Document } from "mongoose";
export interface SocialProfile extends Document {
  userId: mongoose.Types.ObjectId;
  platform: string;
  url: string;
}
const SocialProfileSchema: Schema<SocialProfile> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const SocialProfileModel = mongoose.models.SocialProfile || mongoose.model<SocialProfile>("SocialProfile", SocialProfileSchema);
export default SocialProfileModel;
