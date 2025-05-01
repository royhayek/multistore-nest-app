import { DataSource, DataSourceOptions } from 'typeorm';
import { tenantTypeormConfig } from '@/database/orm/tenant-typeorm.config';

export const tenantConnections: { [schemaName: string]: DataSource } = {};

export async function getTenantConnection(
  schemaId: string,
): Promise<DataSource> {
  const schemaName = `store_${schemaId}`;

  // Check if the connection already exists
  if (tenantConnections[schemaName]) {
    const connection = tenantConnections[schemaName];

    // Ensure the connection is initialized
    if (connection.isInitialized) {
      return connection;
    } else {
      // Reinitialize the connection if it's not valid
      console.warn(`Reinitializing connection for tenant ${schemaId}`);
      await connection.initialize();
      return connection;
    }
  }

  // Create a new connection if it doesn't exist
  try {
    const dataSource = new DataSource({
      ...tenantTypeormConfig,
      name: schemaName,
      schema: schemaName,
      poolSize: Number(process.env.MAX_CONNECTION_POOL_SIZE) || 10, // Default pool size
    } as DataSourceOptions);

    await dataSource.initialize();

    // Cache the initialized connection
    tenantConnections[schemaName] = dataSource;

    return dataSource;
  } catch (error) {
    console.error(
      `Failed to initialize connection for tenant ${schemaId}:`,
      error,
    );
    throw new Error(`Could not establish connection for tenant ${schemaId}`);
  }
}
