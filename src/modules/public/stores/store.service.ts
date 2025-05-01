import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './domain/store';
import { IStoreRepository } from './repository/store.repository.interface';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async create(createStoreDto: CreateStoreDto) {
    return this.storeRepository.create({
      schemaId: createStoreDto.schemaId,
      isActive: createStoreDto.isActive,
      domain: createStoreDto.domain,
      name: createStoreDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.storeRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Store['id']) {
    return this.storeRepository.findById(id);
  }

  findByIds(ids: Store['id'][]) {
    return this.storeRepository.findByIds(ids);
  }

  async update(
    id: Store['id'],

    updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeRepository.update(id, {
      schemaId: updateStoreDto.schemaId,
      isActive: updateStoreDto.isActive,
      domain: updateStoreDto.domain,
      name: updateStoreDto.name,
    });
  }

  remove(id: Store['id']) {
    return this.storeRepository.remove(id);
  }

  async findStoreByUserEmail(email: string) {
    return await this.storeRepository.findStoreByUserEmail(email);
  }
}
