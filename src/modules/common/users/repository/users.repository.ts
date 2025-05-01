import { Injectable, Scope } from '@nestjs/common';

// Entities
import { UserEntity } from '../entities/user.entity';

// Domains
import { User } from '../domain/user';

// Mappers
import { UserMapper } from '../mappers/user.mapper';

// Interfaces
import { IUserRepository } from './user.repository.interface';

// Types
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';

// DTOs
import { FilterUserDto, SortUserDto } from '../dto/query-user.dto';

// Common
import { BaseRepository } from '@/common/base-repository';
import { DataSourceContext } from '@/common/data-source.context';
import { FindOptionsWhere, In, Not } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(dataSourceContext: DataSourceContext) {
    super(dataSourceContext, UserEntity);
  }

  async create(data: User): Promise<User> {
    try {
      const persistenceModel = UserMapper.toPersistence(data);
      const repository = this.getRepository();
      const newEntity = await repository.save(
        repository.create(persistenceModel),
      );
      return UserMapper.toDomain(newEntity);
    } catch (error) {
      console.log('error in creation', error);
      return {} as User;
    }
  }

  async findManyWithPagination({
    user,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    user: User;
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const repository = this.getRepository();

    const where: FindOptionsWhere<UserEntity> = {
      id: Not(user.id as number),
    };

    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: Number(role.id),
      }));
    }

    const entities = await repository.find({
      skip: Math.max(0, (paginationOptions.page - 1) * paginationOptions.limit),
      take: paginationOptions.limit,
      where: where,
      order: { [sortOptions?.orderBy ?? 'id']: sortOptions?.order },
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id: Number(id) },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIds(ids: User['id'][]): Promise<User[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      where: { id: In(ids) },
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { email },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await repository.save(
      repository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    const repository = this.getRepository();
    await repository.softDelete(id);
  }
}
