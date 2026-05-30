import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: Array<{ product: mongoose.Types.ObjectId; quantity: number; savedForLater: boolean; }>;
}

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    savedForLater: { type: Boolean, default: false },
  }],
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', cartSchema);
