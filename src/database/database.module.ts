import { Module } from '@nestjs/common';
import { TenantConnection } from './tenant.connection';

@Module({
  providers: [TenantConnection],
  exports: [TenantConnection],
})
export class DatabaseModule {}
