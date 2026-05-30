import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  label: string; street: string; city: string;
  state: string; pincode: string; isDefault: boolean;
}

export interface IUser extends Document {
  name: string; email: string; mobile: string;
  password: string; role: 'customer' | 'admin' | 'delivery';
  avatar?: string; addresses: IAddress[];
  isVerified: boolean; isActive: boolean;
  refreshToken?: string; otp?: string; otpExpiry?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['customer', 'admin', 'delivery'], default: 'customer' },
  avatar: String,
  addresses: [{
    label: { type: String, default: 'Home' },
    street: String, city: String, state: String, pincode: String,
    isDefault: { type: Boolean, default: false },
  }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
