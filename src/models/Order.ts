import { Schema, model, Document, Types } from 'mongoose';
import { IAddress } from './User';

// Interface for order items
export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number; // Locked-in historical price
}

// Interface for Order Document
export interface IOrder extends Document {
  userId: Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IAddress;
  razorpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Item Schema
const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer value',
      },
    },
    price: {
      type: Number,
      required: [true, 'Locked price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
  },
  { _id: false }
);

// Address Schema definition reused locally for embedded integrity in orders
const OrderAddressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: [true, 'Street is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    zipCode: { type: String, required: [true, 'Zip code is required'], trim: true },
    country: { type: String, default: 'India', trim: true },
  },
  { _id: false }
);

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    products: {
      type: [OrderItemSchema],
      validate: {
        validator: function (val: IOrderItem[]) {
          return val.length > 0;
        },
        message: 'Order must contain at least one product',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be greater than or equal to 0'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
      index: true,
    },
    shippingAddress: {
      type: OrderAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on userId and orderStatus for quick order history retrieval
OrderSchema.index({ userId: 1, orderStatus: 1 });

export const Order = model<IOrder>('Order', OrderSchema);
export default Order;
