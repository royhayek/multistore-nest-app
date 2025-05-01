import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from '@/modules/common/roles/entity/role.entity';
import { RoleSeedService } from './role-seed.service';
import { SharedModule } from '@/common/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), SharedModule],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
