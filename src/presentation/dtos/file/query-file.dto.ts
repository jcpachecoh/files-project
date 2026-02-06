import { IsOptional, IsInt, Min, Max, IsEnum, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum FileSortBy {
  NAME = 'name',
  SIZE = 'size',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryFileDto {
  @IsOptional()
  @IsUUID('4')
  folderId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(FileSortBy)
  sortBy?: FileSortBy = FileSortBy.NAME;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
