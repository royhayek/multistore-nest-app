import {
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Controller,
  SerializeOptions,
  Delete,
  Param,
  Patch,
  Get,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// Services
import { UserService } from './users.service';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';

// Domains
import { User } from './domain/user';
import { UpdateUserDto } from './dto/update-user.dto';
import { NullableType } from '@/utils/types/nullable.type';
import { QueryUserDto } from './dto/query-user.dto';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@/common/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { Roles } from '../roles/roles.decorator';
import { PublicRoleEnum, StoreRoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@Roles(
  PublicRoleEnum.admin,
  PublicRoleEnum.superAdmin,
  StoreRoleEnum.storeOwner,
)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.userService.create(createProfileDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() request,
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 0;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userService.findManyWithPagination({
        user: request.user,
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.userService.findById(id);
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.userService.remove(id);
  }
}
