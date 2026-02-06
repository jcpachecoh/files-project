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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateFolderDto } from '../dtos/folder/create-folder.dto';
import { UpdateFolderDto } from '../dtos/folder/update-folder.dto';
import { MoveFolderDto } from '../dtos/folder/move-folder.dto';
import { QueryFolderDto } from '../dtos/folder/query-folder.dto';
import { CreateFolderUseCase } from '../../application/use-cases/folder/create-folder.use-case';
import { UpdateFolderUseCase } from '../../application/use-cases/folder/update-folder.use-case';
import { DeleteFolderUseCase } from '../../application/use-cases/folder/delete-folder.use-case';
import { MoveFolderUseCase } from '../../application/use-cases/folder/move-folder.use-case';
import { ListFoldersUseCase } from '../../application/use-cases/folder/list-folders.use-case';

@ApiTags('folders')
@Controller('api/folders')
export class FolderController {
  constructor(
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly moveFolderUseCase: MoveFolderUseCase,
    private readonly listFoldersUseCase: ListFoldersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiResponse({ status: 201, description: 'Folder created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreateFolderDto) {
    return this.createFolderUseCase.execute({
      name: dto.name,
      parentId: dto.parentId,
      userId: 'temp-user-id', // Replace with actual user from auth
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all folders' })
  @ApiResponse({ status: 200, description: 'List of folders retrieved successfully' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Parent folder ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  async findAll(@Query() query: QueryFolderDto) {
    return this.listFoldersUseCase.execute({
      parentId: query.parentId,
      userId: 'temp-user-id', // Replace with actual user from auth
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update folder name' })
  @ApiParam({ name: 'id', description: 'Folder UUID' })
  @ApiResponse({ status: 200, description: 'Folder updated successfully' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFolderDto,
  ) {
    return this.updateFolderUseCase.execute({
      id,
      name: dto.name,
      userId: 'temp-user-id',
    });
  }

  @Put(':id/move')
  @ApiOperation({ summary: 'Move folder to another parent' })
  @ApiParam({ name: 'id', description: 'Folder UUID to move' })
  @ApiResponse({ status: 200, description: 'Folder moved successfully' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async move(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MoveFolderDto,
  ) {
    return this.moveFolderUseCase.execute({
      id,
      targetFolderId: dto.targetFolderId,
      userId: 'temp-user-id',
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a folder' })
  @ApiParam({ name: 'id', description: 'Folder UUID' })
  @ApiResponse({ status: 204, description: 'Folder deleted successfully' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteFolderUseCase.execute({
      id,
      userId: 'temp-user-id',
    });
  }
}
