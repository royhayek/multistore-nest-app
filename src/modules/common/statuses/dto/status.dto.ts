import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UserStatusDto {
  @ApiProperty()
  @IsNumber()
  id: number | string;
}
