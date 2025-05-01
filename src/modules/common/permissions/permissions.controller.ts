// Libraries
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Services
import { PermissionsService } from './permissions.service';

// DTOs
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllPermissionsDto } from './dto/find-all-permissions.dto';

// Models
import { Permission } from './domain/permission';

// Utilities
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@/common/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@/utils/infinity-pagination';

// Swagger Decorators
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Permission,
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Permission),
  })
  async findAll(
    @Query() query: FindAllPermissionsDto,
  ): Promise<InfinityPaginationResponseDto<Permission>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.permissionsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Permission,
  })
  findById(@Param('id') id: string) {
    return this.permissionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Permission,
  })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
