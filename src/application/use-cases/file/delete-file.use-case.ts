import { Injectable, Inject } from '@nestjs/common';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { IFileSystem, FILESYSTEM_PORT } from '../../ports/filesystem.port';
import { FileNotFoundException } from '../../../domain/exceptions/file-not-found.exception';

export interface DeleteFileCommand {
  id: string;
  userId: string;
}

@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
    @Inject(FILESYSTEM_PORT)
    private readonly fileSystem: IFileSystem,
  ) {}

  async execute(command: DeleteFileCommand): Promise<void> {
    const file = await this.repository.findFileById(command.id);
    
    if (!file) {
      throw new FileNotFoundException(command.id);
    }

    if (file.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    // Delete physical file
    await this.fileSystem.deleteFile(file.path);
    
    // Delete from database
    await this.repository.deleteFile(command.id);
  }
}
