const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  maxPrice: { type: Number, default: 0 },
  unit: { type: String, default: 'per kg' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  badge: { type: String, default: '' },
  features: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
