import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import assert from 'assert';

async function runTests() {
  console.log('=== STARTING DATABASE & SCHEMA VERIFICATION TESTS ===\n');

  try {
    await connectDB();

    // Clean up any previous test data
    await mongoose.connection.dropDatabase();
    console.log('🧹 Cleaned up test database.');

    // Ensure Indexes are built
    await Product.syncIndexes();
    console.log('⚙️ Re-built database indexes.');

    // ==========================================
    // 1. VERIFY USER CONSTRAINTS & VALIDATIONS
    // ==========================================
    console.log('\n--- Test Case 1: User Schema & Email/Mobile Validations ---');
    
    // Valid user
    const validUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+919876543210',
      password: 'securePassword123',
      role: 'customer',
      addresses: [
        {
          street: '123 Grocery Lane',
          city: 'Ahmedabad',
          state: 'Gujarat',
          zipCode: '380001',
          country: 'India',
          isDefault: true,
        },
      ],
    });
    const savedUser = await validUser.save();
    console.log('✅ Successfully created a valid user.');

    // Check hidden password constraint (select: false)
    const queriedUser = await User.findById(savedUser._id);
    assert.strictEqual(queriedUser?.password, undefined, 'Password field should be excluded from default query results');
    console.log('✅ Excluded password field constraint verified successfully.');

    // Verify we can retrieve password when explicitly requested
    const userWithPassword = await User.findById(savedUser._id).select('+password');
    assert.strictEqual(userWithPassword?.password, 'securePassword123', 'Password should be retrievable when explicitly selected');
    console.log('✅ Explicit password retrieval verified successfully.');

    // Invalid email validation
    try {
      const invalidEmailUser = new User({
        name: 'Invalid Email User',
        email: 'invalid-email-format',
        mobile: '+919998887776',
        password: 'password123',
      });
      await invalidEmailUser.save();
      throw new Error('User schema should have rejected invalid email format');
    } catch (err: any) {
      assert.ok(err.errors.email, 'Mongoose validation should have failed on invalid email format');
      console.log(`✅ Invalid email format rejected correctly: "${err.errors.email.message}"`);
    }

    // Invalid mobile validation
    try {
      const invalidMobileUser = new User({
        name: 'Invalid Mobile User',
        email: 'mobile.fail@example.com',
        mobile: '12345', // Too short
        password: 'password123',
      });
      await invalidMobileUser.save();
      throw new Error('User schema should have rejected invalid mobile number');
    } catch (err: any) {
      assert.ok(err.errors.mobile, 'Mongoose validation should have failed on invalid mobile');
      console.log(`✅ Invalid mobile format rejected correctly: "${err.errors.mobile.message}"`);
    }

    // ==========================================
    // 2. VERIFY PRODUCT CONSTRAINTS & INDEXES
    // ==========================================
    console.log('\n--- Test Case 2: Product Schema & Validations ---');

    // Valid product
    const validProduct = new Product({
      name: 'Organic Basmati Rice',
      category: 'Grains & Rice',
      brand: 'Umiya Farms',
      description: 'Premium quality long-grain aged aromatic basmati rice.',
      price: 120.50,
      stock: 150,
      images: ['/images/basmati.png'],
    });
    const savedProduct = await validProduct.save();
    console.log('✅ Successfully created a valid product.');

    // Negative price validation
    try {
      const negativePriceProduct = new Product({
        name: 'Negative Price Rice',
        category: 'Grains & Rice',
        brand: 'Umiya Farms',
        description: 'Test description',
        price: -10,
        stock: 50,
        images: ['/images/basmati.png'],
      });
      await negativePriceProduct.save();
      throw new Error('Product schema should have rejected negative price');
    } catch (err: any) {
      assert.ok(err.errors.price, 'Mongoose validation should have failed on negative price');
      console.log(`✅ Negative price rejected correctly: "${err.errors.price.message}"`);
    }

    // Negative stock validation
    try {
      const negativeStockProduct = new Product({
        name: 'Negative Stock Rice',
        category: 'Grains & Rice',
        brand: 'Umiya Farms',
        description: 'Test description',
        price: 50,
        stock: -5,
        images: ['/images/basmati.png'],
      });
      await negativeStockProduct.save();
      throw new Error('Product schema should have rejected negative stock');
    } catch (err: any) {
      assert.ok(err.errors.stock, 'Mongoose validation should have failed on negative stock');
      console.log(`✅ Negative stock rejected correctly: "${err.errors.stock.message}"`);
    }

    // Empty images array validation
    try {
      const emptyImagesProduct = new Product({
        name: 'No Image Product',
        category: 'Grains & Rice',
        brand: 'Umiya Farms',
        description: 'Test description',
        price: 50,
        stock: 10,
        images: [], // Invalid
      });
      await emptyImagesProduct.save();
      throw new Error('Product schema should have rejected empty images array');
    } catch (err: any) {
      assert.ok(err.errors.images, 'Mongoose validation should have failed on empty images');
      console.log(`✅ Empty images list rejected correctly: "${err.errors.images.message}"`);
    }

    // ==========================================
    // 3. VERIFY PRODUCT COMPOUND TEXT INDEX
    // ==========================================
    console.log('\n--- Test Case 3: Compound Text Index Search ---');
    
    // Add additional products to search
    await Product.create([
      {
        name: 'Whole Wheat Flour Atta',
        category: 'Flours',
        brand: 'Umiya Premium',
        description: 'Chakki fresh whole wheat flour for soft rotis.',
        price: 260.00,
        stock: 80,
        images: ['/images/atta.png'],
      },
      {
        name: 'Refined Sunflower Oil',
        category: 'Oils & Ghee',
        brand: 'Fortune Gold',
        description: 'Healthy and light refined sunflower cooking oil.',
        price: 180.00,
        stock: 200,
        images: ['/images/oil.png'],
      }
    ]);

    // Search query using compound text index
    const searchResultsName = await Product.find({ $text: { $search: 'Basmati' } });
    assert.strictEqual(searchResultsName.length, 1, 'Should find 1 product matching name "Basmati"');
    assert.strictEqual(searchResultsName[0].name, 'Organic Basmati Rice');
    console.log('✅ Text Search by NAME matches correctly using Text Index.');

    const searchResultsCategory = await Product.find({ $text: { $search: 'Flours' } });
    assert.strictEqual(searchResultsCategory.length, 1, 'Should find 1 product matching category "Flours"');
    assert.strictEqual(searchResultsCategory[0].name, 'Whole Wheat Flour Atta');
    console.log('✅ Text Search by CATEGORY matches correctly using Text Index.');

    const searchResultsBrand = await Product.find({ $text: { $search: 'Fortune' } });
    assert.strictEqual(searchResultsBrand.length, 1, 'Should find 1 product matching brand "Fortune"');
    assert.strictEqual(searchResultsBrand[0].name, 'Refined Sunflower Oil');
    console.log('✅ Text Search by BRAND matches correctly using Text Index.');

    // Check indexes present on collection
    const indexes = await Product.collection.indexes();
    const textIndexExists = indexes.some(idx => idx.name === 'ProductTextSearchIndex');
    assert.ok(textIndexExists, 'Compound text index ProductTextSearchIndex must exist on Products collection');
    console.log('✅ Verified "ProductTextSearchIndex" is present in Mongo indexes configuration.');

    // ==========================================
    // 4. VERIFY ORDER & LOCKED-IN PRICE INTEGRITY
    // ==========================================
    console.log('\n--- Test Case 4: Order Validation & Price Locking ---');

    // Create a valid order referencing savedUser and savedProduct
    const validOrder = new Order({
      userId: savedUser._id,
      products: [
        {
          productId: savedProduct._id,
          quantity: 2,
          price: savedProduct.price, // Lock in price: 120.50
        },
      ],
      totalAmount: savedProduct.price * 2, // 241.00
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress: savedUser.addresses[0], // Subdocument address format
    });
    const savedOrder = await validOrder.save();
    console.log('✅ Successfully created order with locked-in product price.');

    // Verify historical locked-in price integrity
    // Simulate updating the product's actual price in the shop
    savedProduct.price = 150.00; // Price increased!
    await savedProduct.save();
    console.log('🔄 Simulated updating product price to 150.00 in catalog.');

    // Retrieve order and verify that the price in the order remains locked at 120.50
    const retrievedOrder = await Order.findById(savedOrder._id);
    assert.ok(retrievedOrder, 'Order should be retrievable');
    assert.strictEqual(retrievedOrder.products[0].price, 120.50, 'Historical locked-in price should remain 120.50');
    console.log('✅ Checked order records: Price remains locked at 120.50. Integrity verified.');

    // Invalid Order (empty products array)
    try {
      const invalidOrder = new Order({
        userId: savedUser._id,
        products: [], // Invalid: must have at least 1 product
        totalAmount: 0,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        shippingAddress: savedUser.addresses[0],
      });
      await invalidOrder.save();
      throw new Error('Order schema should have rejected empty products list');
    } catch (err: any) {
      assert.ok(err.errors.products, 'Mongoose validation should have failed on empty products');
      console.log(`✅ Empty order products array rejected correctly: "${err.errors.products.message}"`);
    }

    console.log('\n======================================================');
    console.log('🎉 ALL DATABASE CONSTRAINTS & INDEXES VERIFIED SUCCESSFULLY! 🎉');
    console.log('======================================================');

  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:');
    console.error(error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

runTests();
