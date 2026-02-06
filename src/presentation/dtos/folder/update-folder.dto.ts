import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFolderDto {
  @ApiProperty({ description: 'New folder name', example: 'Renamed Folder' })
  @IsString()
  @IsNotEmpty({ message: 'Folder name is required' })
  @MaxLength(255, { message: 'Folder name cannot exceed 255 characters' })
  @Matches(/^[^/\\:*?"<>|]+$/, { message: 'Folder name contains invalid characters' })
  name: string;
}
