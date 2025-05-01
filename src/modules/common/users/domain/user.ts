import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Domains
import { Role } from '../../roles/domain/role';
import { UserStatus } from '../../statuses/domain/status';

const idType = Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: String,
  })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiProperty({
    type: idType,
  })
  roleId?: number;

  @ApiProperty({
    type: () => UserStatus,
  })
  status?: UserStatus;

  @ApiProperty({
    type: idType,
  })
  statusId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
