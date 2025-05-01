import { Injectable } from '@nestjs/common';
import { ProductStatusRepository } from './repository/product-statuses.repository';

@Injectable()
export class ProductStatusService {
  constructor(
    private readonly productStatusRepository: ProductStatusRepository,
  ) {}

  async createStatus(name: string) {
    return this.productStatusRepository.createStatus(name);
  }

  async getAllStatuses() {
    return this.productStatusRepository.findAll();
  }

  async getStatusById(id: number) {
    return this.productStatusRepository.findOne(id);
  }
}
