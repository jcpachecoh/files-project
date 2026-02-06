import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { IFileSystemRepository } from '../../../application/ports/filesystem-repository.port';
import { Folder } from '../../../domain/entities/folder.entity';
import { File } from '../../../domain/entities/file.entity';
import { FolderTypeOrmEntity } from './typeorm/entities/folder.typeorm-entity';
import { FileTypeOrmEntity } from './typeorm/entities/file.typeorm-entity';

@Injectable()
export class FileSystemRepositoryAdapter implements IFileSystemRepository {
  constructor(
    @InjectRepository(FolderTypeOrmEntity)
    private readonly folderRepo: Repository<FolderTypeOrmEntity>,
    @InjectRepository(FileTypeOrmEntity)
    private readonly fileRepo: Repository<FileTypeOrmEntity>,
  ) {}

  // Folder operations
  async createFolder(folder: Folder): Promise<Folder> {
    const entity = this.folderRepo.create({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      userId: folder.userId,
    });
    const saved = await this.folderRepo.save(entity);
    return this.toDomainFolder(saved);
  }

  async findFolderById(id: string): Promise<Folder | null> {
    const entity = await this.folderRepo.findOne({ where: { id } });
    return entity ? this.toDomainFolder(entity) : null;
  }

  async findFoldersByParentId(parentId: string | null, userId: string): Promise<Folder[]> {
    const where: any = { userId };
    if (parentId === null) {
      where.parentId = null;
    } else {
      where.parentId = parentId;
    }
    const entities = await this.folderRepo.find({
      where,
      order: { name: 'ASC' },
    });
    return entities.map(entity => this.toDomainFolder(entity));
  }

  async updateFolder(folder: Folder): Promise<Folder> {
    const entity = this.folderRepo.create({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      userId: folder.userId,
      updatedAt: folder.updatedAt,
    });
    const saved = await this.folderRepo.save(entity);
    return this.toDomainFolder(saved);
  }

  async deleteFolder(id: string): Promise<void> {
    await this.folderRepo.delete(id);
  }

  // File operations
  async createFile(file: File): Promise<File> {
    const entity = this.fileRepo.create({
      id: file.id,
      name: file.name,
      folderId: file.folderId,
      userId: file.userId,
      size: file.size,
      mimeType: file.mimeType,
      path: file.path,
    });
    const saved = await this.fileRepo.save(entity);
    return this.toDomainFile(saved);
  }

  async findFileById(id: string): Promise<File | null> {
    const entity = await this.fileRepo.findOne({ where: { id } });
    return entity ? this.toDomainFile(entity) : null;
  }

  async findFilesByFolderId(folderId: string | null, userId: string): Promise<File[]> {
    const where: any = { userId };
    if (folderId === null) {
      where.folderId = null;
    } else {
      where.folderId = folderId;
    }
    const entities = await this.fileRepo.find({
      where,
      order: { name: 'ASC' },
    });
    return entities.map(entity => this.toDomainFile(entity));
  }

  async updateFile(file: File): Promise<File> {
    const entity = this.fileRepo.create({
      id: file.id,
      name: file.name,
      folderId: file.folderId,
      userId: file.userId,
      size: file.size,
      mimeType: file.mimeType,
      path: file.path,
      updatedAt: file.updatedAt,
    });
    const saved = await this.fileRepo.save(entity);
    return this.toDomainFile(saved);
  }

  async deleteFile(id: string): Promise<void> {
    await this.fileRepo.delete(id);
  }

  async searchFiles(query: string, userId: string): Promise<File[]> {
    const entities = await this.fileRepo.find({
      where: {
        userId,
        name: Like(`%${query}%`),
      },
      order: { name: 'ASC' },
    });
    return entities.map(entity => this.toDomainFile(entity));
  }

  // Mappers
  private toDomainFolder(entity: FolderTypeOrmEntity): Folder {
    return new Folder(
      entity.id,
      entity.name,
      entity.parentId,
      entity.userId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toDomainFile(entity: FileTypeOrmEntity): File {
    return new File(
      entity.id,
      entity.name,
      entity.folderId,
      entity.userId,
      Number(entity.size),
      entity.mimeType,
      entity.path,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
