import { Injectable, Inject } from '@nestjs/common';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { FolderNotFoundException } from '../../../domain/exceptions/folder-not-found.exception';

export interface UpdateFolderCommand {
  id: string;
  name: string;
  userId: string;
}

@Injectable()
export class UpdateFolderUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: UpdateFolderCommand) {
    const folder = await this.repository.findFolderById(command.id);
    
    if (!folder) {
      throw new FolderNotFoundException(command.id);
    }

    if (folder.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    folder.rename(command.name);
    
    return await this.repository.updateFolder(folder);
  }
}
