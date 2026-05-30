import { Schema, model, Document } from 'mongoose';

// Interface for Product Document
export interface IProduct extends Document {
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true, // Single field index for exact matches
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock must be greater than or equal to 0'],
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be an integer value',
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (val: string[]) {
          return val.length > 0;
        },
        message: 'At least one product image is required',
      },
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating average cannot be below 0'],
        max: [5, 'Rating average cannot be above 5'],
        set: (v: number) => Math.round(v * 10) / 10, // Round to 1 decimal place
      },
      count: {
        type: Number,
        default: 0,
        min: [0, 'Rating count cannot be negative'],
        validate: {
          validator: Number.isInteger,
          message: 'Rating count must be an integer value',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound Text Index on name, category, and brand for search optimization
ProductSchema.index(
  {
    name: 'text',
    category: 'text',
    brand: 'text',
  },
  {
    weights: {
      name: 10,
      category: 5,
      brand: 3,
    },
    name: 'ProductTextSearchIndex',
  }
);

export const Product = model<IProduct>('Product', ProductSchema);
export default Product;
