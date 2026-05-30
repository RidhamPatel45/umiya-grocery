import { Schema, model, Document } from 'mongoose';

// Interface for Address Subdocument
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Interface for User Document
export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: 'admin' | 'customer';
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

// Address Schema
const AddressSchema = new Schema<IAddress>(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [
        /^\+?[1-9]\d{9,14}$/,
        'Please enter a valid mobile number (10-15 digits)',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Hidden by default from queries
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'customer'],
        message: '{VALUE} is not a valid role',
      },
      default: 'customer',
    },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

// Export User Model
export const User = model<IUser>('User', UserSchema);
