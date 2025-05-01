import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { DataSource } from 'typeorm';
import { publicTypeormConfig } from '../orm/public-typeorm.config';
import { PermissionSeedService } from './permission/permission-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  const dataSource = new DataSource(publicTypeormConfig);

  // run

  await app.close();

  try {
    await dataSource.initialize();
    console.log('DataSource initialized');

    await app.get(RoleSeedService).run(dataSource, 'public');
    await app.get(PermissionSeedService).run(dataSource, 'public');
    await app.get(StatusSeedService).run(dataSource, 'public');
    await app.get(UserSeedService).run(dataSource, 'public');

    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
    await app.close();
  }
};

void runSeed();
