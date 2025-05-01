import { Session } from '@/modules/common/session/domain/session';
import { User } from '@/modules/common/users/domain/user';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
