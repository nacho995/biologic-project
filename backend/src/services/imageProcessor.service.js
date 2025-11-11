import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { ColorMappingService } from './colorMapping.service.js';

export class ImageProcessorService {
  constructor(baseUploadPath = 'uploads') {
    this.thumbnailSize = 200;
    this.baseUploadPath = baseUploadPath;
    this.colorMapper = new ColorMappingService();
  }

  async generateThumbnail(imagePath) {
    const thumbnailPath = path.join(
      this.baseUploadPath,
      'thumbnails',
      `${path.basename(imagePath, path.extname(imagePath))}_thumb.jpg`
    );

    await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

    await sharp(imagePath)
      .resize(this.thumbnailSize, this.thumbnailSize, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  }

  async getImageDimensions(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      depth: metadata.pages,
    };
  }

  async adjustColor(imagePath, adjustments) {
    // Leer la imagen como buffer
    const imageBuffer = await fs.readFile(imagePath);
    
    // Usar el nuevo ColorMappingService que soporta procesamiento multicanal
    return await this.colorMapper.combineChannels(imageBuffer, adjustments);
  }

  async getImageSlice(imagePath, axis, index) {
    // This is a simplified implementation
    // For real 3D image slicing, you'd need specialized libraries like tiff.js or bioformats
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // For Z-axis (multi-page images like TIFF stacks)
    // Sharp supports multi-page TIFF with the pages property
    if (axis === 'z' && metadata.pages && metadata.pages > 1) {
      const pageIndex = Math.max(0, Math.min(index, metadata.pages - 1));
      // Use extract or return specific page if supported
      // For now, return the full image as Sharp's page() method may not be available in all versions
      // In production, consider using specialized libraries for 3D image processing
      return await image.png().toBuffer();
    }

    // For X and Y axes, we would need to extract a slice from the image
    // This is a simplified version that returns the full image
    // In production, you'd need specialized image processing for 3D volumes
    if (axis === 'x' || axis === 'y') {
      // For now, return the full image
      // TODO: Implement proper slice extraction for X and Y axes using extract()
      return await image.png().toBuffer();
    }

    return await image.png().toBuffer();
  }
}

