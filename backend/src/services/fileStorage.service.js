import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileStorageService {
  constructor(baseUploadPath = 'uploads') {
    this.baseUploadPath = baseUploadPath;
  }

  async saveFile(file, subfolder) {
    const folderPath = path.join(this.baseUploadPath, subfolder);
    await fs.mkdir(folderPath, { recursive: true });

    const fileId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${fileId}${extension}`;
    const filePath = path.join(folderPath, filename);

    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  async saveFiles(files, subfolder) {
    const paths = [];
    for (const file of files) {
      const filePath = await this.saveFile(file, subfolder);
      paths.push(filePath);
    }
    return paths;
  }

  async getFile(filePath) {
    return await fs.readFile(filePath);
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async deleteFile(filePath) {
    await fs.unlink(filePath);
  }
}

