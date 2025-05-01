import { Global, Module } from '@nestjs/common';
import { DataSourceContext } from './data-source.context';

@Global()
@Module({
  providers: [DataSourceContext],
  exports: [DataSourceContext],
})
export class SharedModule {}
