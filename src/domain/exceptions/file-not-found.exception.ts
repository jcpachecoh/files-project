export class FileNotFoundException extends Error {
  constructor(fileId: string) {
    super(`File with ID ${fileId} not found`);
    this.name = 'FileNotFoundException';
  }
}
