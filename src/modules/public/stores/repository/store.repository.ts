import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { StoreEntity } from '../entities/store.entity';
import { NullableType } from '@/utils/types/nullable.type';
import { Store } from '../domain/store';
import { StoreMapper } from '../mappers/store.mapper';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from '@/common/base-repository';
import { DataSourceContext } from '@/common/data-source.context';
import { RoleSeedService } from '@/database/seeds/role/role-seed.service';
import { PermissionSeedService } from '@/database/seeds/permission/permission-seed.service';
import { StatusSeedService } from '@/database/seeds/status/status-seed.service';
import { UserSeedService } from '@/database/seeds/user/user-seed.service';
import { IStoreRepository } from './store.repository.interface';
import { TenantConnection } from '@/database/tenant.connection';
import { UserEntity } from '@/modules/common/users/entities/user.entity';
import { getTenantConnection } from '@/utils/tenancy.utils';

@Injectable()
export class StoreRepository
  extends BaseRepository<StoreEntity>
  implements IStoreRepository
{
  constructor(
    dataSourceContext: DataSourceContext,
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly roleSeedService: RoleSeedService,
    private readonly permissionSeedService: PermissionSeedService,
    private readonly statusSeedService: StatusSeedService,
    private readonly userSeedService: UserSeedService,
  ) {
    super(dataSourceContext, StoreEntity);
  }

  async create(data: Store): Promise<Store> {
    const persistenceModel = StoreMapper.toPersistence(data);

    const repository = this.getRepository();

    // Generate a unique schema ID
    const schemaId = uuidv4().replaceAll('-', '');
    const schemaName = `store_${schemaId}`;

    // ✅ Step 1: Create the tenant schema
    await repository.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    // ✅ Step 2: Save tenant metadata in the public schema
    const store = await repository.save({ ...persistenceModel, schemaId });

    // ✅ Step 3: Get the tenant connection
    const connection = await getTenantConnection(schemaId);
    this.setDataSource(connection);

    try {
      // ✅ Step 4: Run migrations
      await connection.runMigrations();

      // ✅ Step 5: Run migrations
      await this.roleSeedService.run(connection, schemaName, 'store');
      await this.permissionSeedService.run(connection, schemaName, 'store');
      await this.statusSeedService.run(connection, schemaName);
      await this.userSeedService.run(connection, schemaName);
    } catch (error) {
      console.error(
        `Error during tenant setup for schema ${schemaName}:`,
        error,
      );

      // Rollback: Remove the schema and tenant metadata on failure
      await repository.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
      await repository.delete(store.id);

      throw new Error(`Failed to create tenant: ${error.message}`);
    } finally {
      // Close the connection after operations are complete
      if (connection.isInitialized) {
        await connection.destroy();
      }
    }

    return StoreMapper.toDomain(store);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Store[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => StoreMapper.toDomain(entity));
  }

  async findById(id: Store['id']): Promise<NullableType<Store>> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id },
    });

    return entity ? StoreMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Store['id'][]): Promise<Store[]> {
    const repository = this.getRepository();
    const entities = await repository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => StoreMapper.toDomain(entity));
  }

  async update(id: Store['id'], payload: Partial<Store>): Promise<Store> {
    const repository = this.getRepository();
    const entity = await repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await repository.save(
      repository.create(
        StoreMapper.toPersistence({
          ...StoreMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StoreMapper.toDomain(updatedEntity);
  }

  async remove(id: Store['id']): Promise<void> {
    const repository = this.getRepository();
    const store = await repository.findOne({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Remove the store entity
    await repository.delete(id);

    // Remove the store database schema
    const schemaName = `store_${store.schemaId}`;
    await repository.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
  }

  // Try finding the user in each tenant database
  async findStoreByUserEmail(email: string): Promise<Store> {
    const stores = await this.storeRepository.find(); // Get all stores

    for (const store of stores) {
      if (!store.schemaId) {
        throw new Error(`Store with id ${store.id} has no schemaId`);
      }

      const tenantConnection = new TenantConnection();
      const schemaConnection = await tenantConnection.getTenantConnection(
        store.schemaId,
      );

      const userExists = await schemaConnection
        .getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (userExists) return store; // Return the store that has the user
    }

    throw new NotFoundException('User not found in any store');
  }
}
