import { FileStorageService } from '../services/fileStorage.service.js';
import { ImageProcessorService } from '../services/imageProcessor.service.js';
import models from '../models/index.js';

const { Image } = models;
const fileStorage = new FileStorageService();
const imageProcessor = new ImageProcessorService();

export const uploadImages = async (req, res, next) => {
  console.log('uploadImages controller called');
  console.log('req.files:', req.files ? req.files.length : 'undefined');
  console.log('req.body:', req.body);
  
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      console.error('No files received in uploadImages');
      console.error('req.files:', req.files);
      console.error('req.file:', req.file);
      return res.status(400).json({ error: 'No image files provided' });
    }

    console.log(`Processing ${req.files.length} image files...`);
    const { csvUploadId } = req.body;
    const processedImages = [];

    for (const file of req.files) {
      console.log(`Processing file: ${file.originalname} (${file.size} bytes)`);
      
      try {
        const filePath = await fileStorage.saveFile(file, 'images');
        console.log(`File saved: ${filePath}`);
        
        const dimensions = await imageProcessor.getImageDimensions(filePath);
        console.log(`Dimensions: ${JSON.stringify(dimensions)}`);
        
        const thumbnailPath = await imageProcessor.generateThumbnail(filePath);
        console.log(`Thumbnail generated: ${thumbnailPath}`);

        const image = await Image.create({
          csvUploadId: csvUploadId || null,
          imagePath: filePath,
          thumbnailPath,
          originalFilename: file.originalname,
          dimensions,
          metadata: {},
        });
        console.log(`Image record created: ${image.id}`);

        processedImages.push({
          id: image.id,
          path: image.imagePath,
          thumbnailPath: image.thumbnailPath,
          dimensions: image.dimensions,
          originalName: image.originalFilename,
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        throw fileError;
      }
    }

    console.log(`Successfully processed ${processedImages.length} images`);
    res.json({
      count: processedImages.length,
      images: processedImages,
    });
  } catch (error) {
    console.error('Error in uploadImages controller:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

