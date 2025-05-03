import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { publicTypeormConfig } from './database/orm/public-typeorm.config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonModule } from './modules/common/common.module';
import { PublicModule } from './modules/public/public.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import validationOptions from './utils/validation-options';
import { getTenantConnection } from './utils/tenancy.utils';

interface SchemaRow {
  name: string;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI, // Supports versioning like `/v1`
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const serverHost = configService.getOrThrow('app.backendDomain', {
    infer: true,
  });

  // Swagger documentation for Common API
  const commonConfig = new DocumentBuilder()
    .setTitle('Common API')
    .setDescription('API documentation for common endpoints.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const commonDocument = SwaggerModule.createDocument(app, commonConfig, {
    include: [CommonModule],
  });
  SwaggerModule.setup('api/common', app, commonDocument, {
    swaggerOptions: {
      urls: [{ url: `${serverHost}/api/common-json`, name: 'Common API' }],
    },
  });

  // Swagger JSON endpoint for Common API
  app
    .getHttpAdapter()
    .get('/api/common-json', (req, res) => res.json(commonDocument));

  // Swagger documentation for Public API
  const publucConfig = new DocumentBuilder()
    .setTitle('Public API')
    .setDescription('API documentation for public-related endpoints.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const publicDocument = SwaggerModule.createDocument(app, publucConfig, {
    include: [PublicModule],
  });
  SwaggerModule.setup('api/public', app, publicDocument, {
    swaggerOptions: {
      urls: [{ url: `${serverHost}/api/public-json`, name: 'Public API' }],
    },
  });

  // Swagger JSON endpoint for Public API
  app
    .getHttpAdapter()
    .get('/api/public-json', (req, res) => res.json(publicDocument));

  // Swagger documentation for Store API
  const storeConfig = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for store-related endpoints.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const storeDocument = SwaggerModule.createDocument(app, storeConfig, {
    include: [TenantModule],
  });
  SwaggerModule.setup('api/store', app, storeDocument, {
    swaggerOptions: {
      urls: [{ url: `${serverHost}/api/store-json`, name: 'Store API' }],
    },
  });

  // Swagger JSON endpoint for Store API
  app
    .getHttpAdapter()
    .get('/api/store-json', (req, res) => res.json(storeDocument));

  await runTenantMigrations();
  await app.listen(
    process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
  );
}

bootstrap().catch((error) => {
  console.error('❌ Error during application startup:', error);
  process.exit(1);
});

async function runTenantMigrations(): Promise<void> {
  console.log('🔄 Running migrations for all tenant schemas...');

  // Initialize public DataSource
  const dataSource = new DataSource(publicTypeormConfig);
  await dataSource.initialize();
  await dataSource.runMigrations();

  // Retrieve all schemas
  const schemas: SchemaRow[] = await dataSource.query(
    'SELECT schema_name AS name FROM information_schema.schemata;',
  );

  // Run tenant-specific migrations
  for (const { name: schema } of schemas) {
    if (schema.startsWith('store_')) {
      const schemaId = schema.replace('store_', '');
      const tenantConnection = await getTenantConnection(schemaId);
      await tenantConnection.runMigrations();
      await tenantConnection.destroy();
    }
  }

  console.log('✅ Migrations completed for all tenant schemas.');
}
