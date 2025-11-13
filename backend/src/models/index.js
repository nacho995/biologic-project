import sequelize from '../config/database.js';
import Image from './Image.js';
import Composition from './Composition.js';
import User from './User.js';

const models = {
  Image,
  Composition,
  User: User(sequelize),
  sequelize,
};

// Sincronizar modelos (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: false }).catch(console.error);
}

export default models;

