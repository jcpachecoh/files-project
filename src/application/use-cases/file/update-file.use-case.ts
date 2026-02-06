import { Injectable, Inject } from '@nestjs/common';
import { IFileSystemRepository, FILESYSTEM_REPOSITORY } from '../../ports/filesystem-repository.port';
import { FileNotFoundException } from '../../../domain/exceptions/file-not-found.exception';

export interface UpdateFileCommand {
  id: string;
  name: string;
  userId: string;
}

@Injectable()
export class UpdateFileUseCase {
  constructor(
    @Inject(FILESYSTEM_REPOSITORY)
    private readonly repository: IFileSystemRepository,
  ) {}

  async execute(command: UpdateFileCommand) {
    const file = await this.repository.findFileById(command.id);
    
    if (!file) {
      throw new FileNotFoundException(command.id);
    }

    if (file.userId !== command.userId) {
      throw new Error('Unauthorized');
    }

    file.rename(command.name);
    
    return await this.repository.updateFile(file);
  }
}
