import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Composition = sequelize.define(
  'Composition',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    layers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Layers must be an array');
          }
        },
      },
    },
  },
  {
    tableName: 'image_compositions',
    timestamps: true,
    underscored: true,
  }
);

export default Composition;

