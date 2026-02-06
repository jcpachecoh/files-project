import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';

export interface ReadLocalFileCommand {
  path: string;
}

@Injectable()
export class ReadLocalFileUseCase {
  async execute(command: ReadLocalFileCommand): Promise<{ buffer: Buffer; name: string }> {
    try {
      const buffer = await fs.readFile(command.path);
      const name = command.path.split('/').pop() || 'file';
      
      return { buffer, name };
    } catch (error) {
      throw new Error(`Cannot read file: ${error.message}`);
    }
  }
}
