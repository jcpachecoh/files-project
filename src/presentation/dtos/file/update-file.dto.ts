import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiProperty({ description: 'New file name', example: 'renamed-document.pdf' })
  @IsString()
  @IsNotEmpty({ message: 'File name is required' })
  @MaxLength(255, { message: 'File name cannot exceed 255 characters' })
  @Matches(/^[^/\\:*?"<>|]+$/, { message: 'File name contains invalid characters' })
  name: string;
}
