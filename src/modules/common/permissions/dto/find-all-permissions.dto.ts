// Swagger Decorators
import { ApiPropertyOptional } from '@nestjs/swagger';

// Validation and Transformation
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllPermissionsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
