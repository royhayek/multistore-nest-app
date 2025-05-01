/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-require-imports */
import { DataSource, DataSourceOptions } from 'typeorm';
import { publicTypeormConfig } from './public-typeorm.config';
import { tenantTypeormConfig } from './tenant-typeorm.config';
import { camelCase } from 'typeorm/util/StringUtils';

async function main() {
  if (process.argv.length < 3) {
    console.log('Please choose either public or tenant');
    process.exit(1);
  }

  const environment = process.argv[2];
  const type = process.argv[3];

  if (['dev', 'development'].includes(environment)) {
    process.env.NODE_ENV = 'development';
  } else if (['test', 'testing'].includes(environment)) {
    process.env.NODE_ENV = 'test';
  } else if (['prod', 'production'].includes(environment)) {
    process.env.NODE_ENV = 'production';
  } else {
    console.log(
      'Please choose either dev/development, test/testing, or prod/production',
    );
    process.exit(1);
  }

  let dataSource: DataSource | null = null;

  if (type === 'public') {
    dataSource = new DataSource(publicTypeormConfig as DataSourceOptions);
  } else if (type === 'tenant') {
    const firstSchema = await getFirstSchema();
    if (!firstSchema) {
      console.error('No schemas found in the database.');
      process.exit(1);
    }
    dataSource = new DataSource({
      ...tenantTypeormConfig,
      schema: firstSchema, // Dynamically set schema
    } as DataSourceOptions);
  } else {
    console.log('Please choose either public or tenant');
    process.exit(1);
  }

  generateMigrations(dataSource)
    .then(({ upSqls, downSqls }) => {
      console.log('Migration generated successfully');
      const fileContent = getTemplate(
        'migration',
        new Date().getTime(),
        upSqls,
        downSqls.reverse(),
        type,
      );
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(
        __dirname,
        `../migrations/${type}/${new Date().getTime()}-migration.ts`,
      );
      fs.writeFileSync(filePath, fileContent);
      process.exit(0);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}

async function getFirstSchema(): Promise<string | null> {
  const tempDataSource = new DataSource(tenantTypeormConfig);

  try {
    await tempDataSource.initialize();
    const queryRunner = tempDataSource.createQueryRunner();

    // Query to get the first schema name, excluding system schemas
    const result = await queryRunner.query(`
      SELECT schema_name 
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'public')
      LIMIT 1;
    `);

    await queryRunner.release();

    if (result.length > 0) {
      return result[0].schema_name;
    }
    return null;
  } catch (error) {
    console.error('Error fetching schema:', error);
    return null;
  } finally {
    await tempDataSource.destroy();
  }
}

function queryParams(parameters: any[] | undefined): string {
  if (!parameters || !parameters.length) {
    return '';
  }
  return `, ${JSON.stringify(parameters)}`;
}

async function generateMigrations(dataSource: DataSource) {
  const firstSchema = await getFirstSchema();

  if (!firstSchema) {
    throw new Error('No schemas found in the database.');
  }

  if (!dataSource) {
    throw new Error('DataSource is not initialized');
  }
  await dataSource.initialize();
  const logs = await dataSource.driver.createSchemaBuilder().log();
  let upSqls: string[] = [];
  let downSqls: string[] = [];

  logs.upQueries.forEach((upQuery) => {
    upSqls.push(
      `await queryRunner.query(\`${upQuery.query.replace(/`/g, '\\`').replace(new RegExp(firstSchema, 'g'), '${schema}')}\`${queryParams(upQuery.parameters)});`,
    );
  });
  logs.downQueries.forEach((downQuery) => {
    downSqls.push(
      `await queryRunner.query(\`${downQuery.query.replace(/`/g, '\\`').replace(new RegExp(firstSchema, 'g'), '${schema}')}\`${queryParams(downQuery.parameters)});`,
    );
  });

  return { upSqls, downSqls };
}

function getTemplate(
  name: string,
  timestamp: number,
  upSqls: string[],
  downSqls: string[],
  type: string, // Add type parameter to determine conditional logic
): string {
  const migrationName = `${camelCase(name, true)}${timestamp}`;

  // Conditionally include the PostgresConnectionOptions import and schema line for 'tenant'
  const postgresConnectionOptionsImport =
    type === 'tenant'
      ? `import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';`
      : '';

  const schemaLine =
    type === 'tenant'
      ? `const { schema } = queryRunner.connection.options as PostgresConnectionOptions;`
      : '';

  return `import { MigrationInterface, QueryRunner } from 'typeorm'; 
${postgresConnectionOptionsImport}

export class ${migrationName} implements MigrationInterface {
  name = '${migrationName}'

  public async up(queryRunner: QueryRunner): Promise<void> {
    ${schemaLine}
    ${upSqls.join('\n')}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    ${schemaLine}
    ${downSqls.join('\n')}
  }
}
`;
}

// Call the main function
main().catch((error) => {
  console.error('Error in execution:', error);
  process.exit(1);
});
