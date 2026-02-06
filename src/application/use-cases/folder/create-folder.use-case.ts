import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Folder } from '../../../domain/entities/folder.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';

export interface CreateFolderCommand {
  name: string;
  parentId?: string;
  userId: string;
}

@Injectable()
export class CreateFolderUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: CreateFolderCommand): Promise<Folder> {
    const folder = new Folder(
      uuidv4(),
      command.name,
      command.parentId || null,
      command.userId,
      new Date(),
      new Date(),
    );

    return await this.repository.createFolder(folder);
  }
}
