import { Injectable, Scope } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { tenantTypeormConfig } from './orm/tenant-typeorm.config';

@Injectable({ scope: Scope.REQUEST })
export class TenantConnection {
  private tenantConnections: Map<string, DataSource> = new Map();

  async getTenantConnection(storeId: string): Promise<DataSource> {
    if (this.tenantConnections.has(storeId)) {
      return this.tenantConnections.get(storeId) as DataSource;
    }

    const tenantDataSource = new DataSource({
      ...tenantTypeormConfig,
      schema: `store_${storeId}`,
    } as DataSourceOptions);

    await tenantDataSource.initialize();

    // ✅ Ensure the search path includes public schema
    await tenantDataSource.query(
      `SET search_path TO ${`store_${storeId}`}, public;`,
    );

    this.tenantConnections.set(storeId, tenantDataSource);
    return tenantDataSource;
  }
}
