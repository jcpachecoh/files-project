import { Injectable, Inject } from '@nestjs/common';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { FolderNotFoundException } from '../../../domain/exceptions/folder-not-found.exception';

export interface DeleteFolderCommand {
  id: string;
  userId: string;
}

@Injectable()
export class DeleteFolderUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: DeleteFolderCommand): Promise<void> {
    const folder = await this.repository.findFolderById(command.id);
    
    if (!folder) {
      throw new FolderNotFoundException(command.id);
    }

    if (folder.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    await this.repository.deleteFolder(command.id);
  }
}
