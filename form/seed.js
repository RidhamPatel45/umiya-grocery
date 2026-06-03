// Seed script - adds sample products to Umiya Grocery database
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/umiya-grocery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const sampleProducts = [
  // Pulses
  { name: 'Premium Toor Dal', category: 'pulses', price: 80, maxPrice: 120, unit: 'per kg', badge: 'Best Seller', description: 'High-quality yellow pigeon peas, perfect for daily cooking. Rich in protein.', features: ['Fresh Stock', 'Grade A', 'Machine Clean'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
  { name: 'Moong Dal (Yellow)', category: 'pulses', price: 90, maxPrice: 140, unit: 'per kg', badge: 'Premium', description: 'Split green gram without skin. Easy to digest and quick cooking.', features: ['Easy Digest', 'Quick Cook'], image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop' },
  { name: 'Chana Dal', category: 'pulses', price: 70, maxPrice: 110, unit: 'per kg', badge: 'Popular', description: 'Split bengal gram, rich in protein and fiber. Perfect for traditional dishes.', features: ['High Protein', 'Rich Fiber'], image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop' },
  { name: 'Masoor Dal', category: 'pulses', price: 75, maxPrice: 115, unit: 'per kg', badge: 'Healthy', description: 'Red lentils packed with iron and protein. Quick cooking and nutritious.', features: ['Iron Rich', 'Quick Cook'], image: 'https://images.unsplash.com/photo-1610450949065-1f2841536c88?w=400&h=300&fit=crop' },
  { name: 'Rajma (Kidney Beans)', category: 'pulses', price: 120, maxPrice: 180, unit: 'per kg', badge: 'Premium', description: 'Large premium kidney beans perfect for rajma curry and salads.', features: ['Large Size', 'Fresh Stock'], image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop' },
  
  // Spices
  { name: 'Red Chili Powder', category: 'spices', price: 180, maxPrice: 260, unit: 'per kg', badge: 'Best Seller', description: 'Freshly ground red chili powder with perfect heat and color.', features: ['Freshly Ground', 'No Additives'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop' },
  { name: 'Turmeric Powder', category: 'spices', price: 160, maxPrice: 240, unit: 'per kg', badge: 'Organic', description: 'Pure turmeric powder with high curcumin content for health and cooking.', features: ['High Curcumin', 'Pure'], image: 'https://images.unsplash.com/photo-1615485020080-7f89bb8e6b31?w=400&h=300&fit=crop' },
  { name: 'Cumin Seeds (Jeera)', category: 'spices', price: 280, maxPrice: 380, unit: 'per kg', badge: 'Premium', description: 'Aromatic cumin seeds perfect for tadka and seasoning all dishes.', features: ['Aromatic', 'Fresh'], image: 'https://images.unsplash.com/photo-1570694171393-e8e3f8c1ac39?w=400&h=300&fit=crop' },
  { name: 'Garam Masala', category: 'spices', price: 220, maxPrice: 320, unit: 'per kg', badge: 'Popular', description: 'Perfectly blended garam masala with 15+ whole spices for authentic flavor.', features: ['15+ Spices', 'Aromatic Blend'], image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
  
  // Dry Fruits
  { name: 'Premium Almonds', category: 'dryfruit', price: 800, maxPrice: 1200, unit: 'per kg', badge: 'Best Seller', description: 'High-quality California almonds rich in vitamin E and healthy fats.', features: ['Rich in Vitamin E', 'Premium Quality'], image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=300&fit=crop' },
  { name: 'Cashews (Kaju)', category: 'dryfruit', price: 900, maxPrice: 1400, unit: 'per kg', badge: 'Premium', description: 'Creamy cashews packed with essential nutrients and minerals.', features: ['Creamy Texture', 'Nutrient Rich'], image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop' },
  { name: 'Raisins (Kishmish)', category: 'dryfruit', price: 300, maxPrice: 500, unit: 'per kg', badge: 'Popular', description: 'Sweet and juicy raisins perfect for snacking and baking.', features: ['Sweet', 'Rich in Iron'], image: 'https://images.unsplash.com/photo-1454347974296-fd85d6f6ecee?w=400&h=300&fit=crop' },
  
  // Oil
  { name: 'Groundnut Oil', category: 'oil', price: 160, maxPrice: 200, unit: 'per litre', badge: 'Best Seller', description: 'Pure cold-pressed groundnut oil with natural flavor for authentic cooking.', features: ['Cold Pressed', 'Pure'], image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop' },
  { name: 'Sunflower Oil', category: 'oil', price: 140, maxPrice: 175, unit: 'per litre', badge: 'Healthy', description: 'Light refined sunflower oil, low in saturated fat. Perfect for daily cooking.', features: ['Low Fat', 'Light'], image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop' },
  { name: 'Mustard Oil', category: 'oil', price: 150, maxPrice: 190, unit: 'per litre', badge: 'Traditional', description: 'Pungent mustard oil with rich flavor, traditional choice for Indian cooking.', features: ['Traditional', 'Pungent Flavor'], image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop' },
  
  // Flour
  { name: 'Wheat Flour (Atta)', category: 'flour', price: 35, maxPrice: 55, unit: 'per kg', badge: 'Best Seller', description: 'Finely ground whole wheat flour for soft rotis and parathas. Stone-ground.', features: ['Stone Ground', 'Whole Wheat'], image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
  { name: 'Besan (Chickpea Flour)', category: 'flour', price: 65, maxPrice: 90, unit: 'per kg', badge: 'Popular', description: 'Fine chickpea flour for kadhi, pakoras, and sweets. Fresh ground.', features: ['Fresh Ground', 'Fine Texture'], image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
  { name: 'Maida (All Purpose)', category: 'flour', price: 40, maxPrice: 60, unit: 'per kg', badge: 'Premium', description: 'Refined all-purpose flour for baking, bread, and pastries.', features: ['Refined', 'Baking Grade'], image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
  
  // Tea
  { name: 'CTC Masala Chai', category: 'tea', price: 280, maxPrice: 400, unit: 'per kg', badge: 'Best Seller', description: 'Strong CTC tea with masala blend for the perfect morning cup.', features: ['Strong Brew', 'Masala Blend'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { name: 'Green Tea', category: 'tea', price: 350, maxPrice: 500, unit: 'per kg', badge: 'Healthy', description: 'Premium green tea leaves rich in antioxidants for health and wellness.', features: ['Antioxidants', 'Premium'], image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
  
  // Snacks
  { name: 'Moong Dal Namkeen', category: 'snacks', price: 180, maxPrice: 260, unit: 'per kg', badge: 'Popular', description: 'Crispy fried moong dal with spices. Perfect tea-time snack.', features: ['Crispy', 'Spiced'], image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop' },
  { name: 'Chivda Mix', category: 'snacks', price: 140, maxPrice: 200, unit: 'per kg', badge: 'Best Seller', description: 'Traditional Gujarati chivda with flattened rice, nuts, and spices.', features: ['Traditional Recipe', 'Crunchy'], image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop' },
  
  // Household
  { name: 'Vim Dishwash Bar', category: 'household', price: 35, unit: 'per piece', badge: 'Popular', description: 'Effective dishwashing bar that removes tough grease and food stains.', features: ['Anti-Bacterial', 'Grease Removal'], image: 'https://images.unsplash.com/photo-1585674029580-d4d0db99e0b9?w=400&h=300&fit=crop' },
  { name: 'Phenyl Floor Cleaner', category: 'household', price: 80, maxPrice: 120, unit: 'per litre', badge: 'Popular', description: 'Effective floor cleaner with disinfectant for sparkling clean floors.', features: ['Disinfectant', 'Fragrant'], image: 'https://images.unsplash.com/photo-1585674029580-d4d0db99e0b9?w=400&h=300&fit=crop' },
  
  // Personal Hygiene
  { name: 'Dettol Soap (Pack of 4)', category: 'personalhygiene', price: 120, unit: 'per pack', badge: 'Popular', description: 'Anti-bacterial soap for thorough protection against germs and bacteria.', features: ['Anti-Bacterial', '4 Piece Pack'], image: 'https://images.unsplash.com/photo-1563208822-de9f88e79753?w=400&h=300&fit=crop' },
  { name: 'Colgate Toothpaste 200g', category: 'personalhygiene', price: 85, unit: 'per piece', badge: 'Best Seller', description: 'Fresh mint toothpaste for cavity protection and fresh breath all day.', features: ['Cavity Protection', 'Fresh Breath'], image: 'https://images.unsplash.com/photo-1612546958/w=400&h=300&fit=crop' }
];

async function seed() {
  try {
    // Only add products if none exist
    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`✅ Database already has ${existing} products. Skipping seed.`);
      mongoose.disconnect();
      return;
    }
    
    await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} sample products successfully!`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err.message);
    mongoose.disconnect();
  }
}

seed();
