export class Folder {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly parentId: string | null,
    public readonly userId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Folder name cannot be empty');
    }
    if (!/^[^/\\:*?"<>|]+$/.test(newName)) {
      throw new Error('Folder name contains invalid characters');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  isRoot(): boolean {
    return this.parentId === null;
  }
}
