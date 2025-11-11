import csvParser from 'csv-parser';
import { Readable } from 'stream';

export class CSVParserService {
  async parseCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csvParser())
        .on('data', (data) => {
          // Convert numeric strings to numbers
          const processed = { ...data };
          
          // Normalize image_path column name (case insensitive)
          const imagePathKey = Object.keys(data).find(key => 
            key.toLowerCase().trim() === 'image_path' ||
            key.toLowerCase().trim() === 'imagepath' ||
            key.toLowerCase().trim() === 'image path'
          );
          
          if (imagePathKey && imagePathKey !== 'image_path') {
            processed.image_path = data[imagePathKey];
          }
          
          if (data.x) processed.x = Number(data.x) || undefined;
          if (data.y) processed.y = Number(data.y) || undefined;
          if (data.z) processed.z = Number(data.z) || undefined;
          results.push(processed);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  validateCSVStructure(metadata) {
    if (!metadata || metadata.length === 0) {
      return { valid: false, reason: 'CSV is empty or could not be parsed' };
    }

    const firstRow = metadata[0];
    const columns = Object.keys(firstRow);
    
    // Check for image_path column (case insensitive)
    const hasImagePath = columns.some(col => 
      col.toLowerCase().trim() === 'image_path' ||
      col.toLowerCase().trim() === 'imagepath' ||
      col.toLowerCase().trim() === 'image path'
    );
    
    if (!hasImagePath) {
      return { 
        valid: false, 
        reason: `Missing required column 'image_path'. Found columns: ${columns.join(', ')}`,
        columns 
      };
    }

    return { valid: true };
  }
}