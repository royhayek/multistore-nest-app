// Packages
import * as path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config
import { publicTypeormConfig } from './database/orm/public-typeorm.config';

// Modules
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './modules/common/common.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { PublicModule } from './modules/public/public.module';
import { SharedModule } from './common/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenancyInterceptor } from './common/interceptors/tenancy.interceptors';
import { TenancyMiddleware } from './common/middleware/tenancy.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import databaseConfig from './database/config/database.config';
import authConfig from './modules/common/auth/config/auth.config';
import mailConfig from './modules/common/mail/config/mail.config';
import fileConfig from './modules/common/files/config/file.config';
import appConfig from './config/app.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(publicTypeormConfig),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN },
    }),
    SharedModule,
    DatabaseModule,
    PublicModule,
    TenantModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    TenancyMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenancyInterceptor,
    },
  ],
})
export class AppModule {}
