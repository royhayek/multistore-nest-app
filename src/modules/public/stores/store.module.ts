import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { StoreRepository } from './repository/store.repository';
import { IStoreRepository } from './repository/store.repository.interface';
import { RoleSeedModule } from '@/database/seeds/role/role-seed.module';
import { StatusSeedModule } from '@/database/seeds/status/status-seed.module';
import { UserSeedModule } from '@/database/seeds/user/user-seed.module';
import { PermissionSeedModule } from '@/database/seeds/permission/permission-seed.module';
import { StoreSeeder } from './store.seeder';
import { AuthModule } from '@/modules/common/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity]),
    AuthModule,
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    PermissionSeedModule,
  ],
  controllers: [StoreController],
  providers: [
    {
      provide: IStoreRepository,
      useClass: StoreRepository,
    },
    StoreSeeder,
    StoreService,
  ],
  exports: [IStoreRepository],
})
export class StoreModule {}
