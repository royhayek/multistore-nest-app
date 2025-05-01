import { ApiProperty } from '@nestjs/swagger';

export class Store {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  schemaId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  domain: string;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
