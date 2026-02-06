import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Response,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response as ExpressResponse } from 'express';
import { UploadFileDto } from '../dtos/file/upload-file.dto';
import { UpdateFileDto } from '../dtos/file/update-file.dto';
import { MoveFileDto } from '../dtos/file/move-file.dto';
import { QueryFileDto } from '../dtos/file/query-file.dto';
import { UploadFileUseCase } from '../../application/use-cases/file/upload-file.use-case';
import { UpdateFileUseCase } from '../../application/use-cases/file/update-file.use-case';
import { DeleteFileUseCase } from '../../application/use-cases/file/delete-file.use-case';
import { MoveFileUseCase } from '../../application/use-cases/file/move-file.use-case';
import { ListFilesUseCase } from '../../application/use-cases/file/list-files.use-case';
import { DownloadFileUseCase } from '../../application/use-cases/file/download-file.use-case';

@ApiTags('files')
@Controller('api/files')
export class FileController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly updateFileUseCase: UpdateFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly moveFileUseCase: MoveFileUseCase,
    private readonly listFilesUseCase: ListFilesUseCase,
    private readonly downloadFileUseCase: DownloadFileUseCase,
  ) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        folderId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or data' })
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    return this.uploadFileUseCase.execute({
      name: dto.name || file.originalname,
      folderId: dto.folderId,
      userId: 'temp-user-id',
      buffer: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all files' })
  @ApiResponse({ status: 200, description: 'List of files retrieved successfully' })
  async findAll(@Query() query: QueryFileDto) {
    return this.listFilesUseCase.execute({
      folderId: query.folderId,
      userId: 'temp-user-id',
      search: query.search,
      mimeType: query.mimeType,
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a file' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const { file, buffer } = await this.downloadFileUseCase.execute({
      id,
      userId: 'temp-user-id',
    });

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });

    return new StreamableFile(buffer);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file name' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFileDto,
  ) {
    return this.updateFileUseCase.execute({
      id,
      name: dto.name,
      userId: 'temp-user-id',
    });
  }

  @Put(':id/move')
  @ApiOperation({ summary: 'Move file to another folder' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  @ApiResponse({ status: 200, description: 'File moved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async move(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MoveFileDto,
  ) {
    return this.moveFileUseCase.execute({
      id,
      targetFolderId: dto.targetFolderId,
      userId: 'temp-user-id',
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  @ApiResponse({ status: 204, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteFileUseCase.execute({
      id,
      userId: 'temp-user-id',
    });
  }
}
