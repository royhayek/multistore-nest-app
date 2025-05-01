import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionEntity } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ISessionRepository } from './repositories/session.repository.interface';
import { SessionRepository } from './repositories/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: ISessionRepository,
      useClass: SessionRepository,
    },
    SessionService,
  ],
  exports: [SessionService, ISessionRepository],
})
export class SessionModule {}
