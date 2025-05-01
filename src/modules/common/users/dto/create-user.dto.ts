import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsString,
} from 'class-validator';

// DTOs
import { RoleDto } from '../../roles/dto/role.dto';
import { UserStatusDto } from '../../statuses/dto/status.dto';

// Utils
import { lowerCaseTransformer } from '../../../../utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  roleId?: number;

  @ApiPropertyOptional({ type: UserStatusDto })
  @IsOptional()
  @Type(() => UserStatusDto)
  status?: UserStatusDto;

  @ApiPropertyOptional({ type: UserStatusDto })
  @IsOptional()
  @Type(() => UserStatusDto)
  statusId?: number;
}
