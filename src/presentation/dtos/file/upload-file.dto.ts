import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional({ description: 'Custom file name (defaults to original filename)', example: 'document.pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'File name cannot exceed 255 characters' })
  @Matches(/^[^/\\:*?"<>|]+$/, { message: 'File name contains invalid characters' })
  name?: string;

  @ApiPropertyOptional({ description: 'Folder UUID to upload into', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID('4', { message: 'Folder ID must be a valid UUID' })
  folderId?: string;
}
