import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusSeedService } from './status-seed.service';
import { UserStatusEntity } from '@/modules/common/statuses/entity/user-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatusEntity])],
  providers: [StatusSeedService],
  exports: [StatusSeedService],
})
export class StatusSeedModule {}
