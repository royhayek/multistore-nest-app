import { Module } from '@nestjs/common';
import { ProductStatusModule } from './product-statuses/product-statuses.module';
import { SessionModule } from '../common/session/session.module';

@Module({
  imports: [ProductStatusModule, SessionModule],
  controllers: [],
  providers: [],
})
export class TenantModule {}
