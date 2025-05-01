import { Module } from '@nestjs/common';
import { StoreModule } from './stores/store.module';
import { StoreController } from './stores/store.controller';
import { StoreService } from './stores/store.service';

@Module({
  imports: [StoreModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class PublicModule {}
