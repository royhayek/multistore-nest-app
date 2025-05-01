import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionSeedService } from './permission-seed.service';
import { PermissionEntity } from '@/modules/common/permissions/entities/permission.entity';
import { SharedModule } from '@/common/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity]), SharedModule],
  providers: [PermissionSeedService],
  exports: [PermissionSeedService],
})
export class PermissionSeedModule {}
