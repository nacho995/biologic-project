import { CSVParserService } from '../services/csvParser.service.js';
import { FileStorageService } from '../services/fileStorage.service.js';
import models from '../models/index.js';

const { CsvUpload, Image } = models;
const csvParser = new CSVParserService();
const fileStorage = new FileStorageService();

export const createCsvUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      console.error('CSV upload error - req.file is undefined');
      console.error('Request headers:', req.headers);
      console.error('Request body keys:', Object.keys(req.body || {}));
      console.error('Request files:', req.files);
      return res.status(400).json({ 
        error: 'No CSV file provided',
        details: 'The file was not received. Please ensure the file field name is "csv" and Content-Type is multipart/form-data'
      });
    }

    const metadata = await csvParser.parseCSV(req.file.buffer);
    
    const validation = csvParser.validateCSVStructure(metadata);
    if (!validation.valid) {
      console.error('CSV validation failed:', validation.reason);
      console.error('Columns found:', validation.columns);
      return res.status(400).json({ 
        error: 'Invalid CSV structure',
        details: validation.reason,
        columns: validation.columns
      });
    }

    const filePath = await fileStorage.saveFile(req.file, 'csv');

    const csvUpload = await CsvUpload.create({
      filename: req.file.originalname,
      originalFilename: req.file.originalname,
      filePath,
      recordCount: metadata.length,
    });

    // Crear registros de imágenes asociadas
    const imageRecords = await Promise.all(
      metadata.map(async (meta) => {
        return await Image.create({
          csvUploadId: csvUpload.id,
          imagePath: meta.image_path || '',
          originalFilename: meta.image_path || 'unknown',
          metadata: meta,
        });
      })
    );

    res.status(201).json({
      id: csvUpload.id,
      filename: csvUpload.filename,
      recordCount: csvUpload.recordCount,
      imagesCount: imageRecords.length,
      createdAt: csvUpload.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCsvUploads = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'uploadDate', order = 'DESC' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await CsvUpload.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['id'],
        },
      ],
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: rows.map((csv) => ({
        id: csv.id,
        filename: csv.filename,
        originalFilename: csv.originalFilename,
        recordCount: csv.recordCount,
        imagesCount: csv.images?.length || 0,
        uploadDate: csv.uploadDate,
        createdAt: csv.createdAt,
        updatedAt: csv.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getCsvUploadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const csvUpload = await CsvUpload.findByPk(id, {
      include: [
        {
          model: Image,
          as: 'images',
        },
      ],
    });

    if (!csvUpload) {
      return res.status(404).json({ error: 'CSV upload not found' });
    }

    res.json({
      id: csvUpload.id,
      filename: csvUpload.filename,
      originalFilename: csvUpload.originalFilename,
      filePath: csvUpload.filePath,
      recordCount: csvUpload.recordCount,
      uploadDate: csvUpload.uploadDate,
      images: csvUpload.images,
      createdAt: csvUpload.createdAt,
      updatedAt: csvUpload.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCsvUpload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filename, description } = req.body;

    const csvUpload = await CsvUpload.findByPk(id);

    if (!csvUpload) {
      return res.status(404).json({ error: 'CSV upload not found' });
    }

    if (filename) csvUpload.filename = filename;

    await csvUpload.save();

    res.json({
      id: csvUpload.id,
      filename: csvUpload.filename,
      updatedAt: csvUpload.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCsvUpload = async (req, res, next) => {
  try {
    const { id } = req.params;

    const csvUpload = await CsvUpload.findByPk(id, {
      include: [{ model: Image, as: 'images' }],
    });

    if (!csvUpload) {
      return res.status(404).json({ error: 'CSV upload not found' });
    }

    // Eliminar archivos físicos
    try {
      await fileStorage.deleteFile(csvUpload.filePath);
      
      // Eliminar thumbnails de imágenes asociadas
      for (const image of csvUpload.images || []) {
        if (image.thumbnailPath) {
          await fileStorage.deleteFile(image.thumbnailPath).catch(() => {});
        }
        if (image.imagePath) {
          await fileStorage.deleteFile(image.imagePath).catch(() => {});
        }
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
    }

    // Eliminar de base de datos (CASCADE eliminará las imágenes)
    await csvUpload.destroy();

    res.json({ message: 'CSV upload deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

