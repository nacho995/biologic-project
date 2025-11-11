import sequelize from '../config/database.js';
import '../models/index.js';

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false, force: false });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
