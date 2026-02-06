import {
  Controller,
  Get,
  Query,
  StreamableFile,
  Response,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { ListLocalFilesUseCase } from '../../application/use-cases/file/list-local-files.use-case';
import { ReadLocalFileUseCase } from '../../application/use-cases/file/read-local-file.use-case';

@ApiTags('local')
@Controller('api/local')
export class LocalFilesController {
  constructor(
    private readonly listLocalFilesUseCase: ListLocalFilesUseCase,
    private readonly readLocalFileUseCase: ReadLocalFileUseCase,
  ) {}

  @Get('files')
  @ApiOperation({ summary: 'List files from local computer directory' })
  @ApiQuery({ name: 'path', required: false, description: 'Directory path (defaults to home directory)' })
  @ApiResponse({ status: 200, description: 'List of local files and folders' })
  @ApiResponse({ status: 400, description: 'Cannot read directory' })
  async listFiles(@Query('path') dirPath?: string) {
    try {
      return await this.listLocalFilesUseCase.execute({
        directory: dirPath || process.env.HOME || '/',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('download')
  @ApiOperation({ summary: 'Download a file from local computer' })
  @ApiQuery({ name: 'path', required: true, description: 'Full path to the file' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 400, description: 'Cannot read file or invalid path' })
  async downloadFile(
    @Query('path') filePath: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    if (!filePath) {
      throw new BadRequestException('File path is required');
    }

    try {
      const { buffer, name } = await this.readLocalFileUseCase.execute({
        path: filePath,
      });

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${name}"`,
      });

      return new StreamableFile(buffer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
