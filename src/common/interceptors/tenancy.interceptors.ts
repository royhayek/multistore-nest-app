import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { createDataSource } from '@/config/typeorm.config';
import { DataSourceContext } from '../data-source.context';

@Injectable({ scope: Scope.REQUEST })
export class TenancyInterceptor implements NestInterceptor {
  constructor(private readonly dataSourceContext: DataSourceContext) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const schemaId = request.headers['schema'];
    const schema = schemaId ? `store_${schemaId}` : 'public';
    const dataSource = await createDataSource(schema);
    this.dataSourceContext.setDataSource(dataSource);

    return next.handle();
  }
}
