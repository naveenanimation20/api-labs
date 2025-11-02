// scripts/migrate.js
const { sequelize } = require('../models');

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Sync all models (creates tables)
    await sequelize.sync({ force: process.env.FORCE_SYNC === 'true' });

    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

migrate();