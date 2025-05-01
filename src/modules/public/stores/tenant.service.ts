import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { TenantConnection } from '../../../database/tenant.connection';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  private tenantDataSource: DataSource;

  constructor(
    private readonly tenantConnection: TenantConnection,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getTenantRepository(entity) {
    const storeId = this.request['storeId'];
    if (!storeId) {
      throw new Error('Store ID is missing in request');
    }
    this.tenantDataSource =
      await this.tenantConnection.getTenantConnection(storeId);
    return this.tenantDataSource.getRepository(entity);
  }
}
