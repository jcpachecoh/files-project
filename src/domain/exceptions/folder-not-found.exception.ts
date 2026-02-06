export class FolderNotFoundException extends Error {
  constructor(folderId: string) {
    super(`Folder with ID ${folderId} not found`);
    this.name = 'FolderNotFoundException';
  }
}
