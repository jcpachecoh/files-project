export const FILESYSTEM_PORT = Symbol('IFileSystem');

export interface IFileSystem {
  saveFile(path: string, buffer: Buffer): Promise<void>;
  readFile(path: string): Promise<Buffer>;
  deleteFile(path: string): Promise<void>;
  moveFile(sourcePath: string, destinationPath: string): Promise<void>;
  fileExists(path: string): Promise<boolean>;
}
