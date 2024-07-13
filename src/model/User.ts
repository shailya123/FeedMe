import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  rating:number;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  rating:{
    type:Number,
    required:true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date; // Corrected typo here
  isVerified: boolean;
  isAcceptingMessages: boolean; // Corrected typo here
  resetPasswordToken:string;
  resetPasswordExpires:Date;
  profileImg:string;
  pincode:string;
  address:string;
  contactNumber:string;
  gender:string;
  state?:string;
  country?:string;
  city?:string;
  birthdate:Date;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
    default: Date.now, // Use a function to get the current date
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpires: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    default: '',
  },
  profileImg: {
    type: String,
    default: '',
  },
  pincode: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  contactNumber: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  city:{
    type: String,
    default: '', 
  },
  birthdate:{
    type: Date,
  },
  messages: [MessageSchema],
});

// Conditionally define the model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export default UserModel;
