import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ description: 'Folder name', example: 'My Documents' })
  @IsString()
  @IsNotEmpty({ message: 'Folder name is required' })
  @MaxLength(255, { message: 'Folder name cannot exceed 255 characters' })
  @Matches(/^[^/\\:*?"<>|]+$/, { message: 'Folder name contains invalid characters' })
  name: string;

  @ApiPropertyOptional({ description: 'Parent folder UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID('4', { message: 'Parent folder ID must be a valid UUID' })
  parentId?: string;
}
