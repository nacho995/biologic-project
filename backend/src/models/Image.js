import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CsvUpload from './CsvUpload.js';

const Image = sequelize.define(
  'Image',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    csvUploadId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'csv_uploads',
        key: 'id',
      },
      field: 'csv_upload_id',
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'image_path',
    },
    thumbnailPath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'thumbnail_path',
    },
    originalFilename: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_filename',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    dimensions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'upload_date',
    },
  },
  {
    tableName: 'images',
    timestamps: true,
    underscored: true,
  }
);

// Definir relaciones
Image.belongsTo(CsvUpload, {
  foreignKey: 'csvUploadId',
  as: 'csvUpload',
});

CsvUpload.hasMany(Image, {
  foreignKey: 'csvUploadId',
  as: 'images',
});

export default Image;

