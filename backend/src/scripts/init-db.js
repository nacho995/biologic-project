import sequelize from '../config/database.js';
import '../models/index.js';
import UserModel from '../models/User.js';

const User = UserModel(sequelize);

const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin',
    emailVerified: true,
    isActive: true,
  },
  {
    email: 'worker@demo.com',
    password: 'demo123',
    name: 'Worker User',
    role: 'worker',
    emailVerified: true,
    isActive: true,
  },
  {
    email: 'viewer@demo.com',
    password: 'demo123',
    name: 'Viewer User',
    role: 'viewer',
    emailVerified: true,
    isActive: true,
  },
];

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false, force: false });
    console.log('Database tables synchronized.');

    // Create demo users if they don't exist
    for (const userData of demoUsers) {
      try {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        
        if (!existingUser) {
          await User.create(userData);
          console.log(`✅ Demo user created: ${userData.email} (${userData.role})`);
        }
      } catch (error) {
        // Ignore duplicate errors
        if (!error.message.includes('unique')) {
          console.log(`⚠️ Could not create ${userData.email}:`, error.message);
        }
      }
    }
    console.log('✅ Demo users initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
