// Swagger Decorators
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/domain/role';

export class Permission {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  permission: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
