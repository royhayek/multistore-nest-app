// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { PermissionsController } from './permissions.controller';

// Services
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { PermissionEntity } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
