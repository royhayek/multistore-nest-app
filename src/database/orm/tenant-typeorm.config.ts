import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';
import { publicTypeormConfig } from './public-typeorm.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const tenantTypeormConfig: DataSourceOptions &
  PostgresConnectionOptions = {
  ...publicTypeormConfig,
  entities: [
    join(__dirname, '../../modules/common/**/*.entity{.ts,.js}'),
    join(__dirname, '../../modules/tenant/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../migrations/tenant/*{.ts,.js}')],
};

export const TenantDataSource = new DataSource(tenantTypeormConfig);
