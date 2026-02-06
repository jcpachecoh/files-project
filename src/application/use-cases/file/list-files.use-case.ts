import { Injectable, Inject } from '@nestjs/common';
import { File } from '../../../domain/entities/file.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';

export interface ListFilesCommand {
  folderId?: string;
  userId: string;
  search?: string;
  mimeType?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable()
export class ListFilesUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: ListFilesCommand): Promise<File[]> {
    if (command.search) {
      return await this.repository.searchFiles(command.search, command.userId);
    }
    
    return await this.repository.findFilesByFolderId(
      command.folderId || null,
      command.userId,
    );
  }
}
