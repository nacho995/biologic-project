import models from '../models/index.js';

const { Image } = models;

export const getMetadata = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    
    const image = await Image.findByPk(imageId);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      imageId,
      metadata: image.metadata || {},
    });
  } catch (error) {
    console.error('Error getting metadata:', error);
    next(error);
  }
};

export const getAllMetadata = async (req, res, next) => {
  try {
    const { filter } = req.query;
    
    const images = await Image.findAll({
      attributes: ['id', 'metadata'],
    });

    let results = images.map((image) => ({
      imageId: image.id,
      metadata: image.metadata || {},
    }));

    // Simple filtering (extend as needed)
    if (filter) {
      const filterObj = JSON.parse(filter);
      results = results.filter((item) => {
        const value = item.metadata[filterObj.field];
        switch (filterObj.operator) {
          case 'equals':
            return value === filterObj.value;
          case 'contains':
            return String(value).includes(String(filterObj.value));
          default:
            return true;
        }
      });
    }

    res.json({
      count: results.length,
      metadata: results,
    });
  } catch (error) {
    console.error('Error getting all metadata:', error);
    next(error);
  }
};

