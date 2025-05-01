import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StoreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
