import { DeepPartial } from '../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';

// DTOs
import { FilterUserDto, SortUserDto } from '../dto/query-user.dto';

// Domains
import { User } from '../domain/user';

export abstract class IUserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    user,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    user: User;
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findByIds(ids: User['id'][]): Promise<User[]>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract remove(id: User['id']): Promise<void>;
}
