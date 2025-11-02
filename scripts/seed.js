// scripts/seed.js
const { sequelize, User, Category, Product } = require('../models');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create test users
    const users = await User.bulkCreate([
      {
        name: 'Test User',
        email: 'test@apilabs.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@apilabs.com',
        password: 'admin123',
        role: 'admin'
      }
    ]);
    console.log('✅ Created test users');

    // Create categories
    const categories = await Category.bulkCreate([
      { name: 'Electronics', description: 'Electronic devices' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Books', description: 'Books and publications' }
    ]);
    console.log('✅ Created categories');

    // Create products
    await Product.bulkCreate([
      {
        name: 'Laptop',
        price: 999.99,
        categoryId: categories[0].id,
        stock: 50,
        sku: 'LAP-001'
      },
      {
        name: 'T-Shirt',
        price: 19.99,
        categoryId: categories[1].id,
        stock: 100,
        sku: 'TSH-001'
      }
    ]);
    console.log('✅ Created products');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seed();