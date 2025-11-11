import { FileStorageService } from '../services/fileStorage.service.js';
import { ImageProcessorService } from '../services/imageProcessor.service.js';
import { ColorMappingService } from '../services/colorMapping.service.js';
import models from '../models/index.js';
import sharp from 'sharp';

const { Image, CsvUpload } = models;
const fileStorage = new FileStorageService();
const imageProcessor = new ImageProcessorService();
const colorMapper = new ColorMappingService();

export const getAllImages = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      csvUploadId,
      sortBy = 'uploadDate',
      order = 'DESC',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (csvUploadId) {
      where.csvUploadId = csvUploadId;
    }

    const { count, rows } = await Image.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: CsvUpload,
          as: 'csvUpload',
          attributes: ['id', 'filename'],
        },
      ],
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

export const getImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id, {
      include: [
        {
          model: CsvUpload,
          as: 'csvUpload',
        },
      ],
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    next(error);
  }
};

export const getImagesByCsv = async (req, res, next) => {
  try {
    const { csvId } = req.params;

    const images = await Image.findAll({
      where: { csvUploadId: csvId },
      order: [['uploadDate', 'DESC']],
    });

    res.json({
      count: images.length,
      images,
    });
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { metadata, csvUploadId } = req.body;

    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (metadata) image.metadata = { ...image.metadata, ...metadata };
    if (csvUploadId !== undefined) image.csvUploadId = csvUploadId;

    await image.save();

    res.json(image);
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Eliminar archivos físicos
    try {
      if (image.imagePath) {
        await fileStorage.deleteFile(image.imagePath).catch(() => {});
      }
      if (image.thumbnailPath) {
        await fileStorage.deleteFile(image.thumbnailPath).catch(() => {});
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
    }

    await image.destroy();

    res.json({ message: 'Image deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

// Mantener endpoints existentes para compatibilidad
export const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      return next(error);
    }

    const ext = image.imagePath.split('.').pop()?.toLowerCase();
    
    // For TIFF files, convert to PNG for browser compatibility
    if (ext === 'tif' || ext === 'tiff') {
      console.log(`Converting TIFF to PNG for image ${id}`);
      const imageBuffer = await fileStorage.getFile(image.imagePath);
      console.log(`Read TIFF file: ${image.imagePath}, size: ${imageBuffer.length} bytes`);
      
      const pngBuffer = await sharp(imageBuffer)
        .png()
        .toBuffer();
      
      console.log(`Converted to PNG, size: ${pngBuffer.length} bytes`);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(pngBuffer);
    } else {
      // For other formats (PNG, JPEG, etc.), send directly
      const imageBuffer = await fileStorage.getFile(image.imagePath);
      res.setHeader('Content-Type', `image/${ext === 'jpg' ? 'jpeg' : ext}`);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(imageBuffer);
    }
  } catch (error) {
    console.error('Error in getImage:', error);
    next(error);
  }
};

export const getThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image || !image.thumbnailPath) {
      const error = new Error('Thumbnail not found');
      error.statusCode = 404;
      return next(error);
    }

    const thumbnailBuffer = await fileStorage.getFile(image.thumbnailPath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(thumbnailBuffer);
  } catch (error) {
    next(error);
  }
};

export const adjustColor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustments } = req.body;
    const image = await Image.findByPk(id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      return next(error);
    }

    console.log(`Adjusting color for image ${id}, adjustments:`, JSON.stringify(adjustments, null, 2));
    
    // Leer la imagen original
    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // Aplicar colormaps usando el servicio de mapeo de colores
    const processedBuffer = await colorMapper.combineChannels(
      imageBuffer,
      adjustments
    );

    // Always return as PNG for consistent browser compatibility
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(processedBuffer);
  } catch (error) {
    console.error('Error in adjustColor:', error);
    next(error);
  }
};

export const getSlice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { axis, index } = req.query;
    const image = await Image.findByPk(id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      return next(error);
    }

    const sliceBuffer = await imageProcessor.getImageSlice(
      image.imagePath,
      axis,
      Number(index)
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(sliceBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /images/:id/quantitative-analysis
 * Obtiene análisis cuantitativo completo de la imagen
 */
export const getQuantitativeAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    const metadata = await sharp(imageBuffer).metadata();

    // Obtener ajustes activos desde query params o usar defaults
    const adjustments = req.query.adjustments 
      ? JSON.parse(req.query.adjustments)
      : [{ channel: 0, colorId: 2, contrast: 100, enabled: true }];

    // Realizar análisis cuantitativo
    const analysis = await colorMapper.performQuantitativeAnalysis(
      imageBuffer,
      adjustments
    );

    // Agregar metadatos de imagen
    analysis.imageMetadata = {
      width: metadata.width || 0,
      height: metadata.height || 0,
      channels: metadata.channels || 1,
      format: metadata.format || 'unknown',
      depth: metadata.pages || 1,
    };

    res.json({
      status: 'success',
      imageId: id,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in getQuantitativeAnalysis:', error);
    next(error);
  }
};

/**
 * POST /images/:id/segment
 * Realiza segmentación celular básica
 */
export const performCellSegmentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { method = 'threshold', options = {} } = req.body;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // Segmentación básica usando threshold
    // En producción usarías modelos de ML avanzados
    const segmentedBuffer = await colorMapper.performBasicSegmentation(
      imageBuffer,
      method,
      options
    );

    res.setHeader('Content-Type', 'image/png');
    res.send(segmentedBuffer);
  } catch (error) {
    console.error('Error in performCellSegmentation:', error);
    next(error);
  }
};

/**
 * POST /images/:id/export/ome-tiff
 * Exporta imagen a formato OME-TIFF
 */
export const exportToOMETIFF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustments = [] } = req.body;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // Procesar imagen con ajustes si se proporcionan
    let processedBuffer = imageBuffer;
    if (adjustments.length > 0) {
      processedBuffer = await colorMapper.combineChannels(imageBuffer, adjustments);
    }

    // Convertir a TIFF (simplificado - en producción usarías biblioteca OME-TIFF completa)
    const tiffBuffer = await sharp(processedBuffer)
      .tiff()
      .toBuffer();

    res.setHeader('Content-Type', 'image/tiff');
    res.setHeader('Content-Disposition', `attachment; filename="image_${id}.ome.tiff"`);
    res.send(tiffBuffer);
  } catch (error) {
    console.error('Error in exportToOMETIFF:', error);
    next(error);
  }
};

/**
 * POST /images/:id/export/hdf5
 * Exporta imagen a formato HDF5 (simplificado)
 */
export const exportToHDF5 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Nota: HDF5 requiere biblioteca especializada (h5py en Python)
    // Esta es una implementación simplificada que devuelve JSON
    // En producción, usarías un servicio Python o biblioteca Node.js para HDF5
    
    const imageBuffer = await fileStorage.getFile(image.imagePath);
    const metadata = await sharp(imageBuffer).metadata();

    res.json({
      status: 'info',
      message: 'HDF5 export requires specialized library. Returning metadata structure.',
      imageId: id,
      structure: {
        '/image/data': {
          shape: [metadata.height, metadata.width, metadata.channels || 1],
          dtype: 'uint8',
        },
        '/image/metadata': {
          width: metadata.width,
          height: metadata.height,
          channels: metadata.channels || 1,
          format: metadata.format,
        },
      },
      note: 'For full HDF5 export, implement using h5py (Python) or hdf5-js (Node.js)',
    });
  } catch (error) {
    console.error('Error in exportToHDF5:', error);
    next(error);
  }
};
