import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { IFileSystem } from '../../../application/ports/filesystem.port';

@Injectable()
export class LocalFileSystemAdapter implements IFileSystem {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  async saveFile(filePath: string, buffer: Buffer): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);
    const dir = path.dirname(fullPath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }

  async readFile(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.uploadDir, filePath);
    return await fs.readFile(fullPath);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);
    await fs.unlink(fullPath);
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    const fullSourcePath = path.join(this.uploadDir, sourcePath);
    const fullDestPath = path.join(this.uploadDir, destinationPath);
    
    await fs.mkdir(path.dirname(fullDestPath), { recursive: true });
    await fs.rename(fullSourcePath, fullDestPath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.uploadDir, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
