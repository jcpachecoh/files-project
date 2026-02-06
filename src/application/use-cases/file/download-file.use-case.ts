import { Injectable, Inject } from '@nestjs/common';
import { File } from '../../../domain/entities/file.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { IFileSystem, FILESYSTEM_PORT } from '../../ports/filesystem.port';
import { FileNotFoundException } from '../../../domain/exceptions/file-not-found.exception';

export interface DownloadFileCommand {
  id: string;
  userId: string;
}

@Injectable()
export class DownloadFileUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
    @Inject(FILESYSTEM_PORT)
    private readonly fileSystem: IFileSystem,
  ) {}

  async execute(command: DownloadFileCommand): Promise<{ file: File; buffer: Buffer }> {
    const file = await this.repository.findFileById(command.id);
    
    if (!file) {
      throw new FileNotFoundException(command.id);
    }

    if (file.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    const buffer = await this.fileSystem.readFile(file.path);
    
    return { file, buffer };
  }
}
