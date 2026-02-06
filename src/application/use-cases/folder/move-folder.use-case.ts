import { Injectable, Inject } from '@nestjs/common';
import { Folder } from '../../../domain/entities/folder.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { FolderNotFoundException } from '../../../domain/exceptions/folder-not-found.exception';

export interface MoveFolderCommand {
  id: string;
  targetFolderId?: string;
  userId: string;
}

@Injectable()
export class MoveFolderUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: MoveFolderCommand) {
    const folder = await this.repository.findFolderById(command.id);
    
    if (!folder) {
      throw new FolderNotFoundException(command.id);
    }

    if (folder.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    // Create a new folder instance with updated parentId
    const movedFolder = new Folder(
      folder.id,
      folder.name,
      command.targetFolderId || null,
      folder.userId,
      folder.createdAt,
      new Date(),
    );

    return await this.repository.updateFolder(movedFolder);
  }
}
