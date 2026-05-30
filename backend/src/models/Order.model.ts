import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  items: Array<{ product: mongoose.Types.ObjectId; name: string; image: string; price: number; quantity: number; }>;
  shippingAddress: { name: string; mobile: string; street: string; city: string; state: string; pincode: string; };
  itemsTotal: number; shippingCharge: number; discount: number; totalAmount: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string; razorpayPaymentId?: string;
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: Array<{ status: string; timestamp: Date; note?: string }>;
}

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, price: Number, quantity: Number }],
  shippingAddress: { name: String, mobile: String, street: String, city: String, state: String, pincode: String },
  itemsTotal: Number, shippingCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, totalAmount: Number,
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String, razorpayPaymentId: String,
  orderStatus: { type: String, enum: ['placed','confirmed','processing','shipped','delivered','cancelled'], default: 'placed' },
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderId) this.orderId = 'UMY' + Date.now().toString().slice(-8).toUpperCase();
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
