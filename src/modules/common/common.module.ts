import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './users/users.controller';
import { UserService } from './users/users.service';
import { MailService } from './mail/mail.service';
import { MailerService } from './mailer/mailer.service';
import { SessionService } from './session/session.service';
import { SessionModule } from './session/session.module';

@Module({
  imports: [AuthModule, UserModule, SessionModule],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserService,
    SessionService,
    MailService,
    MailerService,
  ],
})
export class CommonModule {}
