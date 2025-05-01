import { Module } from '@nestjs/common';
import { ProductStatusService } from './product-statuses.service';
import { ProductStatusRepository } from './repository/product-statuses.repository';
import { ProductStatusController } from './product-statuses.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductStatusController],
  providers: [ProductStatusService, ProductStatusRepository],
})
export class ProductStatusModule {}
