import { DataSource, ObjectLiteral, Repository, TreeRepository } from 'typeorm';
import { DataSourceContext } from './data-source.context';

export abstract class BaseRepository<Entity extends ObjectLiteral> {
  protected constructor(
    private readonly dataSourceContext: DataSourceContext,
    private readonly entity: new () => Entity, // Entity class type
  ) {}

  protected getRepository(): Repository<Entity> {
    const dataSource = this.dataSourceContext.getDataSource();
    return dataSource.getRepository(this.entity);
  }

  protected getTreeRepository(): TreeRepository<Entity> {
    const dataSource = this.dataSourceContext.getDataSource();
    return dataSource.getTreeRepository(this.entity);
  }

  protected setDataSource(dataSource: DataSource) {
    this.dataSourceContext.setDataSource(dataSource);
  }
}
