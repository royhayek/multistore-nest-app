import { publicTypeormConfig } from '@/database/orm/public-typeorm.config';
import { tenantTypeormConfig } from '@/database/orm/tenant-typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export function getDataSourceOptions(schema?: string): DataSourceOptions {
  return schema !== 'public'
    ? { ...tenantTypeormConfig, schema }
    : { ...publicTypeormConfig, schema: 'public' };
}

export const createDataSource = async (
  schema?: string,
): Promise<DataSource> => {
  const dataSource = new DataSource(getDataSourceOptions(schema));
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
};
