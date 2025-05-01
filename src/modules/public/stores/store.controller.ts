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
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Store } from './domain/store';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@/common/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { FindAllStoresDto } from './dto/find-all-stores.dto';
import { StoreService } from './store.service';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'public/stores',
  version: '1',
})
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiCreatedResponse({
    type: Store,
  })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Store),
  })
  async findAll(
    @Query() query: FindAllStoresDto,
  ): Promise<InfinityPaginationResponseDto<Store>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.storeService.findAllWithPagination({
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
    type: Store,
  })
  findById(@Param('id') id: string) {
    return this.storeService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Store,
  })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
