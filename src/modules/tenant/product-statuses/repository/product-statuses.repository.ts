import { Injectable, Inject, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductStatus } from '../entity/product-status.entity';
import { REQUEST } from '@nestjs/core';
import { TenantConnection } from 'src/database/tenant.connection';

@Injectable({ scope: Scope.REQUEST })
export class ProductStatusRepository {
  private repository: Repository<ProductStatus>;

  constructor(
    private readonly tenantConnection: TenantConnection,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getRepository(): Promise<Repository<ProductStatus>> {
    const storeId = this.request['storeId'];
    console.debug('storeId', storeId);
    if (!storeId) throw new Error('Store ID is missing in request headers');

    const dataSource = await this.tenantConnection.getTenantConnection(storeId);
    return dataSource.getRepository(ProductStatus);
  }

  async createStatus(name: string): Promise<ProductStatus> {
    const repo = await this.getRepository();
    const status = repo.create({ name });
    return repo.save(status);
  }

  async findAll(): Promise<ProductStatus[]> {
    const repo = await this.getRepository();
    return repo.find();
  }

  async findOne(id: number): Promise<ProductStatus> {
    const repo = await this.getRepository();
    const status = await repo.findOne({ where: { id } });
    if (!status) throw new Error(`ProductStatus with id ${id} not found`);
    return status;
  }
}
