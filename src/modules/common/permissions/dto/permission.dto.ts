// Swagger Decorators
import { ApiProperty } from '@nestjs/swagger';

// Validation
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
