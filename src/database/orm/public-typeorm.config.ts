import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const publicTypeormConfig: DataSourceOptions &
  PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'multi_store_db',
  synchronize: false,
  dropSchema: false,
  logging: true,
  entities: [
    join(__dirname, '../../modules/common/**/*.entity{.ts,.js}'),
    join(__dirname, '../../modules/public/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../migrations/public/*{.ts,.js}')],
};

export const PublicDataSource = new DataSource(publicTypeormConfig);
