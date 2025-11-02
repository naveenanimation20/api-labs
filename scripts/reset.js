// scripts/reset.js
const { sequelize } = require('../models');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function reset() {
  try {
    console.log('⚠️  WARNING: This will delete ALL data in the database!');
    console.log('⚠️  This action cannot be undone!');
    console.log('');

    rl.question('Are you sure you want to reset the database? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Database reset cancelled');
        rl.close();
        process.exit(0);
      }

      console.log('');
      console.log('🔄 Starting database reset...');

      // Drop all tables and recreate them
      await sequelize.sync({ force: true });

      console.log('✅ Database has been reset successfully!');
      console.log('');
      console.log('📝 Next steps:');
      console.log('   1. Run migrations: npm run migrate');
      console.log('   2. Seed database: npm run seed');
      console.log('   3. Start server: npm run dev');
      console.log('');

      rl.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    rl.close();
    process.exit(1);
  }
}

reset();