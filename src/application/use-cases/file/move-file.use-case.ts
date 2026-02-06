import { Injectable, Inject } from '@nestjs/common';
import { File } from '../../../domain/entities/file.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { FileNotFoundException } from '../../../domain/exceptions/file-not-found.exception';

export interface MoveFileCommand {
  id: string;
  targetFolderId?: string;
  userId: string;
}

@Injectable()
export class MoveFileUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: MoveFileCommand) {
    const file = await this.repository.findFileById(command.id);
    
    if (!file) {
      throw new FileNotFoundException(command.id);
    }

    if (file.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    // Create a new file instance with updated folderId
    const movedFile = new File(
      file.id,
      file.name,
      command.targetFolderId || null,
      file.userId,
      file.size,
      file.mimeType,
      file.path,
      file.createdAt,
      new Date(),
    );

    return await this.repository.updateFile(movedFile);
  }
}
