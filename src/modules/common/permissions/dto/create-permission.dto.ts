import {
  IsOptional,
  // decorators here
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RoleDto } from '../../roles/dto/role.dto';

export class CreatePermissionDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;
  @IsString()
  permission: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
