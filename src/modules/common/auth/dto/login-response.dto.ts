import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/common/users/domain/user';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty()
  schemaId?: string;
}
