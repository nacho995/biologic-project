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
    console.log(`getImageSlice: path=${imagePath}, axis=${axis}, index=${index}`);
    
    const imageBuffer = await fs.readFile(imagePath);
    const metadata = await sharp(imageBuffer).metadata();
    
    console.log(`Image metadata: ${metadata.width}x${metadata.height}, pages=${metadata.pages || 1}, format=${metadata.format}`);

    // Para Z-axis (TIFF multi-página)
    if (axis === 'z' && metadata.pages && metadata.pages > 1) {
      const pageIndex = Math.max(0, Math.min(parseInt(index), metadata.pages - 1));
      console.log(`Extracting Z-slice (page) ${pageIndex} from ${metadata.pages} total pages`);
      
      try {
        // Sharp puede extraer páginas específicas de TIFF multi-página
        const sliceBuffer = await sharp(imageBuffer, { page: pageIndex })
          .png()
          .toBuffer();
        
        console.log(`Z-slice ${pageIndex} extracted successfully`);
        return sliceBuffer;
      } catch (error) {
        console.error(`Error extracting Z-slice ${pageIndex}:`, error);
        // Fallback: retornar la primera página
        return await sharp(imageBuffer).png().toBuffer();
      }
    }

    // Para Y-axis: extraer una fila horizontal específica y expandirla
    if (axis === 'y') {
      const yIndex = Math.max(0, Math.min(parseInt(index), metadata.height - 1));
      console.log(`Extracting Y-slice (row) ${yIndex} from height ${metadata.height}`);
      
      // Extraer una franja horizontal de 1 píxel de alto, luego escalarla
      const sliceBuffer = await sharp(imageBuffer)
        .extract({ 
          left: 0, 
          top: yIndex, 
          width: metadata.width, 
          height: 1 
        })
        .resize(metadata.width, metadata.height, {
          kernel: 'nearest', // Sin interpolación para mantener valores exactos
          fit: 'fill'
        })
        .png()
        .toBuffer();
      
      console.log(`Y-slice ${yIndex} extracted and scaled`);
      return sliceBuffer;
    }

    // Para X-axis: extraer una columna vertical específica y expandirla
    if (axis === 'x') {
      const xIndex = Math.max(0, Math.min(parseInt(index), metadata.width - 1));
      console.log(`Extracting X-slice (column) ${xIndex} from width ${metadata.width}`);
      
      // Extraer una franja vertical de 1 píxel de ancho, luego escalarla
      const sliceBuffer = await sharp(imageBuffer)
        .extract({ 
          left: xIndex, 
          top: 0, 
          width: 1, 
          height: metadata.height 
        })
        .resize(metadata.width, metadata.height, {
          kernel: 'nearest',
          fit: 'fill'
        })
        .png()
        .toBuffer();
      
      console.log(`X-slice ${xIndex} extracted and scaled`);
      return sliceBuffer;
    }

    // Fallback
    return await sharp(imageBuffer).png().toBuffer();
  }
}

