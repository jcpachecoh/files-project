import { Injectable, Inject } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface LocalFileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: Date;
}

export interface LocalFilesResponse {
  currentPath: string;
  items: LocalFileInfo[];
}

export interface ListLocalFilesCommand {
  directory: string;
}

@Injectable()
export class ListLocalFilesUseCase {
  async execute(command: ListLocalFilesCommand): Promise<LocalFilesResponse> {
    try {
      const dirPath = command.directory || process.env.HOME || '/';
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      const files: LocalFileInfo[] = [];
      
      for (const entry of entries) {
        try {
          const fullPath = path.join(dirPath, entry.name);
          const stats = await fs.stat(fullPath);
          
          files.push({
            name: entry.name,
            path: fullPath,
            isDirectory: entry.isDirectory(),
            size: stats.size,
            modified: stats.mtime,
          });
        } catch (err) {
          // Skip files we can't access
          continue;
        }
      }
      
      const sortedFiles = files.sort((a, b) => {
        // Directories first, then alphabetically
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      return {
        currentPath: dirPath,
        items: sortedFiles,
      };
    } catch (error) {
      throw new Error(`Cannot read directory: ${error.message}`);
    }
  }
}
