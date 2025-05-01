import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserRepository } from './repository/users.repository';
import { UserController } from './users.controller';
import { IUserRepository } from './repository/user.repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    UserService,
  ],
  exports: [IUserRepository],
})
export class UserModule {}
