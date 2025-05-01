import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  // BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { NullableType } from '@/utils/types/nullable.type';
import { User } from '../users/domain/user';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUpdateDto } from './dto/auth-update.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'schema',
    description: 'Tenant Identifier',
    required: false,
  })
  async register(@Body() createUserDto: AuthRegisterDto): Promise<{
    status: number;
    message: string;
  }> {
    return this.service.register(createUserDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this.service.validateLogin(loginDto);
  }

  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Post('store/email/login')
  // @ApiOkResponse({
  //   type: LoginResponseDto,
  // })
  // @ApiHeader({
  //   name: 'schema',
  //   description: 'Tenant Identifier (required for store login)',
  //   required: false, // Optional overall, but validated dynamically
  // })
  // @HttpCode(HttpStatus.OK)
  // public storeLogin(
  //   @Request() req,
  //   @Body() loginDto: AuthEmailLoginDto,
  // ): Promise<LoginResponseDto> {
  //   const schema = req.headers['schema']; // Extract schema header
  //   const isTenantRequest = !!schema;

  //   if (isTenantRequest && schema === 'public') {
  //     throw new BadRequestException('Schema is required for tenant login.');
  //   }

  //   return this.service.validateStoreLogin(loginDto);
  // }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post('email/confirm/new')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmNewEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmNewEmail(confirmEmailDto.hash);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  public me(@Request() request): Promise<NullableType<User>> {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<RefreshResponseDto> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
  })
  public update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Request() request): Promise<void> {
    return this.service.softDelete(request.user);
  }
}
