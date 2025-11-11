import models from '../models/index.js';

const { Composition, Image } = models;

export const createComposition = async (req, res, next) => {
  try {
    const { name, description, layers } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!layers || !Array.isArray(layers)) {
      return res.status(400).json({ error: 'Layers must be an array' });
    }

    // Validar que todas las imágenes existan
    const imageIds = layers.map((layer) => layer.imageId);
    const images = await Image.findAll({
      where: { id: imageIds },
    });

    if (images.length !== imageIds.length) {
      return res.status(400).json({ error: 'One or more images not found' });
    }

    const composition = await Composition.create({
      name,
      description: description || '',
      layers,
    });

    res.status(201).json(composition);
  } catch (error) {
    next(error);
  }
};

export const getAllCompositions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Composition.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompositionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const composition = await Composition.findByPk(id);

    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    res.json(composition);
  } catch (error) {
    next(error);
  }
};

export const updateComposition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, layers } = req.body;

    const composition = await Composition.findByPk(id);

    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    if (name) composition.name = name;
    if (description !== undefined) composition.description = description;
    if (layers) {
      // Validar imágenes si se actualizan las capas
      const imageIds = layers.map((layer) => layer.imageId);
      const images = await Image.findAll({
        where: { id: imageIds },
      });

      if (images.length !== imageIds.length) {
        return res.status(400).json({ error: 'One or more images not found' });
      }

      composition.layers = layers;
    }

    await composition.save();

    res.json(composition);
  } catch (error) {
    next(error);
  }
};

export const deleteComposition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const composition = await Composition.findByPk(id);

    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    await composition.destroy();

    res.json({ message: 'Composition deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

export const renderComposition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const composition = await Composition.findByPk(id);

    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    // Esta función renderizará la composición en el backend
    // Por ahora retornamos los datos, el renderizado se hará en frontend
    res.json({
      composition,
      message: 'Use frontend to render composition',
    });
  } catch (error) {
    next(error);
  }
};

