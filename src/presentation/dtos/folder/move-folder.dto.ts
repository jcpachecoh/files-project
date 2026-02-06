import { IsUUID, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MoveFolderDto {
  @ApiPropertyOptional({ description: 'Target parent folder UUID (null for root)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID('4', { message: 'Target folder ID must be a valid UUID' })
  targetFolderId?: string;
}
