// Libraries
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

// Models and Mappers
import { Permission } from '../domain/permission';
import { PermissionMapper } from '../mappers/permission.mapper';

// Entities
import { PermissionEntity } from '../entities/permission.entity';

// Repositories
import { BaseRepository } from '@/common/base-repository';
import { PermissionRepository } from './permission.repository.interface';

// Utilities and Types
import { NullableType } from '@/utils/types/nullable.type';
import { DataSourceContext } from '@/common/data-source.context';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class PermissionRelationalRepository
  extends BaseRepository<PermissionEntity>
  implements PermissionRepository
{
  constructor(dataSourceContext: DataSourceContext) {
    super(dataSourceContext, PermissionEntity);
  }

  async create(data: Permission): Promise<Permission> {
    const persistenceModel = PermissionMapper.toPersistence(data);
    const repository = this.getRepository();
    const newEntity = repository.create(persistenceModel);
    await repository.save(newEntity);
    return PermissionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Permission[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PermissionMapper.toDomain(entity));
  }

  async findById(id: Permission['id']): Promise<NullableType<Permission>> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id },
    });

    return entity ? PermissionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Permission['id'][]): Promise<Permission[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PermissionMapper.toDomain(entity));
  }

  async update(
    id: Permission['id'],
    payload: Partial<Permission>,
  ): Promise<Permission> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await repository.save(
      repository.create(
        PermissionMapper.toPersistence({
          ...PermissionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PermissionMapper.toDomain(updatedEntity);
  }

  async remove(id: Permission['id']): Promise<void> {
    const repository = this.getRepository();
    await repository.delete(id);
  }
}
