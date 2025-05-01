import {
  IsBoolean,
  // decorators here
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateStoreDto {
  schemaId?: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: () => Boolean,
    default: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  domain: string;
  // Don't forget to use the class-validator decorators in the DTO properties.
}
