import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../../../domain/entities/file.entity';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { IFileSystem, FILESYSTEM_PORT } from '../../ports/filesystem.port';

export interface UploadFileCommand {
  name: string;
  folderId?: string;
  userId: string;
  buffer: Buffer;
  mimeType: string;
  size: number;
}

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
    @Inject(FILESYSTEM_PORT)
    private readonly fileSystem: IFileSystem,
  ) {}

  async execute(command: UploadFileCommand): Promise<File> {
    const fileId = uuidv4();
    const path = `${command.userId}/${fileId}`;

    // Save physical file
    await this.fileSystem.saveFile(path, command.buffer);

    // Save metadata to database
    const file = new File(
      fileId,
      command.name,
      command.folderId || null,
      command.userId,
      command.size,
      command.mimeType,
      path,
      new Date(),
      new Date(),
    );

    return await this.repository.createFile(file);
  }
}
