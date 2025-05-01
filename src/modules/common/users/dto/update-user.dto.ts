import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';

// DTOs
import { CreateUserDto } from './create-user.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { UserStatusDto } from '../../statuses/dto/status.dto';

// Utils
import { lowerCaseTransformer } from '../../../../utils/transformers/lower-case.transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiPropertyOptional({ example: 'John', type: String })
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe', type: String })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ type: () => RoleDto })
  @IsOptional()
  @Type(() => Number)
  roleId?: number;

  @ApiPropertyOptional({ type: () => UserStatusDto })
  @IsOptional()
  @Type(() => Number)
  statusId?: number;
}
