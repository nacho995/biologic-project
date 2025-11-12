export const up = async (queryInterface, Sequelize) => {
  // Crear tabla images
  await queryInterface.createTable('images', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    image_path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    thumbnail_path: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    original_filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    dimensions: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    upload_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  // Crear tabla image_compositions
  await queryInterface.createTable('image_compositions', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    layers: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  // Crear índices
  await queryInterface.addIndex('images', ['upload_date']);
  await queryInterface.addIndex('image_compositions', ['created_at']);
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('image_compositions');
  await queryInterface.dropTable('images');
};

