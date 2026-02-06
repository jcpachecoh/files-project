export class File {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly folderId: string | null,
    public readonly userId: string,
    public readonly size: number,
    public readonly mimeType: string,
    public readonly path: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }
    if (!/^[^/\\:*?"<>|]+$/.test(newName)) {
      throw new Error('File name contains invalid characters');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  getExtension(): string {
    return this.name.split('.').pop() || '';
  }

  isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }
}
