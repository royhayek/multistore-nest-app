import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { SessionModule } from '../session/session.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    SessionModule,
    MailModule,
    JwtModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
