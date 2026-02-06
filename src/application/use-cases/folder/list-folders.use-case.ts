import { Injectable, Inject } from '@nestjs/common';
import { Folder } from '../../../domain/entities/folder.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';

export interface ListFoldersCommand {
  parentId?: string;
  userId: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable()
export class ListFoldersUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: ListFoldersCommand): Promise<Folder[]> {
    return await this.repository.findFoldersByParentId(
      command.parentId || null,
      command.userId,
    );
  }
}
