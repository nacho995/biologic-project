import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CsvUpload = sequelize.define(
  'CsvUpload',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalFilename: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_filename',
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_path',
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'upload_date',
    },
    recordCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'record_count',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
    },
  },
  {
    tableName: 'csv_uploads',
    timestamps: true,
    underscored: true,
  }
);

export default CsvUpload;

