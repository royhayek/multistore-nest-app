import { Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class DataSourceContext {
  private dataSource: DataSource;

  setDataSource(dataSource: DataSource): void {
    this.dataSource = dataSource;
  }

  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('DataSource has not been set for the current request.');
    }
    return this.dataSource;
  }
}
