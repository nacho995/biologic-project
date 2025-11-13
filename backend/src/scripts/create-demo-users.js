import sequelize from '../config/database.js';
import UserModel from '../models/User.js';

const User = UserModel(sequelize);

const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'worker@demo.com',
    password: 'demo123',
    name: 'Worker User',
    role: 'worker',
  },
  {
    email: 'viewer@demo.com',
    password: 'demo123',
    name: 'Viewer User',
    role: 'viewer',
  },
];

async function createDemoUsers() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync User model
    await User.sync();
    console.log('User table synced.');

    // Create demo users
    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      await User.create(userData);
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\n✅ Demo users created successfully!');
    console.log('\nYou can now login with:');
    console.log('  Admin: admin@demo.com / demo123');
    console.log('  Worker: worker@demo.com / demo123');
    console.log('  Viewer: viewer@demo.com / demo123');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    await sequelize.close();
    process.exit(1);
  }
}

createDemoUsers();

