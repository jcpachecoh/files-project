import { Folder } from '../../domain/entities/folder.entity';
import { File } from '../../domain/entities/file.entity';

export const FILESYSTEM_REPOSITORY = Symbol('IFileSystemRepository');

export interface IFileSystemRepository {
  // Folder operations
  createFolder(folder: Folder): Promise<Folder>;
  findFolderById(id: string): Promise<Folder | null>;
  findFoldersByParentId(parentId: string | null, userId: string): Promise<Folder[]>;
  updateFolder(folder: Folder): Promise<Folder>;
  deleteFolder(id: string): Promise<void>;
  
  // File operations
  createFile(file: File): Promise<File>;
  findFileById(id: string): Promise<File | null>;
  findFilesByFolderId(folderId: string | null, userId: string): Promise<File[]>;
  updateFile(file: File): Promise<File>;
  deleteFile(id: string): Promise<void>;
  searchFiles(query: string, userId: string): Promise<File[]>;
}
