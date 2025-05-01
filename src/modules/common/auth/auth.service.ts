import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { StoreRoleEnum } from '../roles/roles.enum';
import { UserStatusEnum } from '../statuses/user-statuses.enum';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { REQUEST } from '@nestjs/core';
import { MailService } from '../mail/mail.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { SessionService } from '../session/session.service';
import { Session } from '../session/domain/session';
import { User } from '../users/domain/user';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { NullableType } from '@/utils/types/nullable.type';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
// import { UserEntity } from '../users/entities/user.entity';
// import { TenantConnection } from '@/database/tenant.connection';
// import { SessionEntity } from '../session/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private userService: UserService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const schemaId = this.request.headers['schema'];

    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
      schemaId,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  // async validateStoreLogin(
  //   loginDto: AuthEmailLoginDto,
  // ): Promise<LoginResponseDto> {
  //   // 1️⃣ Find the store (tenant) by searching all stores
  //   const store = await this.storesService.findStoreByUserEmail(loginDto.email);
  //   if (!store) throw new UnauthorizedException('Store not found');

  //   // 2️⃣ Connect to the correct store's database
  //   if (!store.schemaId) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         schema: 'Schema ID is missing',
  //       },
  //     });
  //   }

  //   const tenantConnection = await getTenantConnection(
  //     store.schemaId,
  //   );
  //   const userRepository = tenantConnection.getRepository(UserEntity);

  //   const user = await userRepository.findOne({
  //     where: { email: loginDto.email },
  //   });

  //   if (!user) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         email: 'notFound',
  //       },
  //     });
  //   }

  //   if (!user.password) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         password: 'incorrectPassword',
  //       },
  //     });
  //   }

  //   const isValidPassword = await bcrypt.compare(
  //     loginDto.password,
  //     user.password,
  //   );

  //   if (!isValidPassword) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         password: 'incorrectPassword',
  //       },
  //     });
  //   }

  //   const hash = crypto
  //     .createHash('sha256')
  //     .update(randomStringGenerator())
  //     .digest('hex');

  //   const sessionRepository = tenantConnection.getRepository(SessionEntity); // Store users exist in tenant DB

  //   const session = await sessionRepository.save({ user, hash });

  //   const { token, refreshToken, tokenExpires } = await this.getTokensData({
  //     id: user.id,
  //     role: user.role,
  //     sessionId: session.id,
  //     schemaId: store.schemaId,
  //     hash,
  //   });

  //   return {
  //     refreshToken,
  //     token,
  //     tokenExpires,
  //     user,
  //     schemaId: store.schemaId,
  //   };
  // }

  async register(dto: AuthRegisterDto): Promise<{
    status: number;
    message: string;
  }> {
    if (!dto.role) {
      dto.role = {
        id: StoreRoleEnum.customer,
      };
    }
    if (!dto.status) {
      dto.status = {
        id: UserStatusEnum.inactive,
      };
    }
    const user = await this.userService.create(dto);
    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
        schemaId: this.request['schema'],
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash,
      },
    });
    return {
      status: HttpStatus.CREATED,
      message: 'User registered successfully. Please confirm your email.',
    };
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];
    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    if (user?.status?.id?.toString() !== UserStatusEnum.inactive.toString()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `alreadyConfirmed`,
        },
      });
    }

    user.status = {
      id: UserStatusEnum.active,
    };

    await this.userService.update(user.id, user);
  }

  async confirmNewEmail(hash: string): Promise<void> {
    let userId: User['id'];
    let newEmail: User['email'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
        newEmail: User['email'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
      newEmail = jwtData.newEmail;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.email = newEmail;
    user.status = {
      id: UserStatusEnum.active,
    };

    await this.userService.update(user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }

    const tokenExpiresIn = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    await this.userService.update(user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.userService.findById(userJwtPayload.id);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.userService.findById(userJwtPayload.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'missingOldPassword',
          },
        });
      }

      if (!currentUser.password) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        });
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            oldPassword: 'incorrectOldPassword',
          },
        });
      } else {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.userService.findByEmail(userDto.email);

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailExists',
          },
        });
      }

      const hash = await this.jwtService.signAsync(
        {
          confirmEmailUserId: currentUser.id,
          newEmail: userDto.email,
        },
        {
          secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
            infer: true,
          }),
        },
      );

      await this.mailService.confirmNewEmail({
        to: userDto.email,
        data: {
          hash,
        },
      });
    }

    delete userDto.email;
    delete userDto.oldPassword;

    await this.userService.update(userJwtPayload.id, userDto);

    return this.userService.findById(userJwtPayload.id);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const schemaId = this.request['schema'];
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.userService.findById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: {
        id: user.role.id,
      },
      sessionId: session.id,
      hash,
      schemaId,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.userService.remove(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
    schemaId?: string;
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const tokenPayload: Record<string, any> = {
      id: data.id,
      role: data.role,
      sessionId: data.sessionId,
    };

    if (data.schemaId) {
      tokenPayload.schemaId = data.schemaId;
    }

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      }),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
