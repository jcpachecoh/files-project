import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './infrastructure/config/database.config';

// TypeORM Entities
import { FolderTypeOrmEntity } from './infrastructure/adapters/persistence/typeorm/entities/folder.typeorm-entity';
import { FileTypeOrmEntity } from './infrastructure/adapters/persistence/typeorm/entities/file.typeorm-entity';

// Adapters
import { FileSystemRepositoryAdapter } from './infrastructure/adapters/persistence/filesystem-repository.adapter';
import { LocalFileSystemAdapter } from './infrastructure/adapters/filesystem/local-filesystem.adapter';

// Ports
import { FILESYSTEM_REPOSITORY } from './application/ports/filesystem-repository.port';
import { FILESYSTEM_PORT } from './application/ports/filesystem.port';

// Use Cases - Folder
import { CreateFolderUseCase } from './application/use-cases/folder/create-folder.use-case';
import { UpdateFolderUseCase } from './application/use-cases/folder/update-folder.use-case';
import { DeleteFolderUseCase } from './application/use-cases/folder/delete-folder.use-case';
import { MoveFolderUseCase } from './application/use-cases/folder/move-folder.use-case';
import { ListFoldersUseCase } from './application/use-cases/folder/list-folders.use-case';

// Use Cases - File
import { UploadFileUseCase } from './application/use-cases/file/upload-file.use-case';
import { UpdateFileUseCase } from './application/use-cases/file/update-file.use-case';
import { DeleteFileUseCase } from './application/use-cases/file/delete-file.use-case';
import { MoveFileUseCase } from './application/use-cases/file/move-file.use-case';
import { DownloadFileUseCase } from './application/use-cases/file/download-file.use-case';
import { ListFilesUseCase } from './application/use-cases/file/list-files.use-case';
import { ListLocalFilesUseCase } from './application/use-cases/file/list-local-files.use-case';
import { ReadLocalFileUseCase } from './application/use-cases/file/read-local-file.use-case';

// Controllers
import { FolderController } from './presentation/controllers/folder.controller';
import { FileController } from './presentation/controllers/file.controller';
import { LocalFilesController } from './presentation/controllers/local-files.controller';

// Keep old controller/service for backward compatibility
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database')!,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([FolderTypeOrmEntity, FileTypeOrmEntity]),
  ],
  controllers: [
    AppController,
    FolderController,
    FileController,
    LocalFilesController,
  ],
  providers: [
    AppService,
    // Adapters
    {
      provide: FILESYSTEM_REPOSITORY,
      useClass: FileSystemRepositoryAdapter,
    },
    {
      provide: FILESYSTEM_PORT,
      useClass: LocalFileSystemAdapter,
    },
    // Folder Use Cases
    CreateFolderUseCase,
    UpdateFolderUseCase,
    DeleteFolderUseCase,
    MoveFolderUseCase,
    ListFoldersUseCase,
    // File Use Cases
    UploadFileUseCase,
    UpdateFileUseCase,
    DeleteFileUseCase,
    MoveFileUseCase,
    DownloadFileUseCase,
    // Local File System Use Cases
    ListLocalFilesUseCase,
    ReadLocalFileUseCase,
    ListFilesUseCase,
  ],
})
export class AppModule {}
