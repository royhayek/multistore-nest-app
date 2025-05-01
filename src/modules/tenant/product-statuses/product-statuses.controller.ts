import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { ProductStatusService } from './product-statuses.service';

@Controller('product-status')
export class ProductStatusController {
  constructor(private readonly productStatusService: ProductStatusService) {}

  @Post()
  async createStatus(@Req() req, @Body('name') name: string) {
    return this.productStatusService.createStatus(name);
  }

  @Get()
  async getAllStatuses(@Req() req) {
    return this.productStatusService.getAllStatuses();
  }

  @Get(':id')
  async getStatusById(@Req() req, @Param('id') id: number) {
    return this.productStatusService.getStatusById(id);
  }
}
