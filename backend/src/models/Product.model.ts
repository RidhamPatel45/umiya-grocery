import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IProduct extends Document {
  name: string; slug: string; description: string;
  category: mongoose.Types.ObjectId; brand: string;
  price: number; mrp: number; discount: number;
  weight: string; stock: number; images: string[];
  averageRating: number; totalReviews: number;
  isFeatured: boolean; isActive: boolean; tags: string[];
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: 'Generic' },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  weight: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: [String],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true }) + '-' + Date.now();
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
