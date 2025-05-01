import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { PermissionSeedModule } from './permission/permission-seed.module';
import databaseConfig from '@/database/config/database.config';
import appConfig from '@/config/app.config';
import { publicTypeormConfig } from '../orm/public-typeorm.config';

@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    PermissionSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(publicTypeormConfig),
  ],
})
export class SeedModule {}
