import {
  Injectable,
  NestMiddleware,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenancyMiddleware.name);

  constructor(private readonly dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const schemaId = req.headers['schema'] as string;

    // Step 1: Check if the tenant schema exists in the database
    if (schemaId) {
      const schemaName = `store_${schemaId}`;
      const tenantExists = await this.checkTenantExists(schemaName);

      if (!tenantExists) {
        this.logger.warn(`Tenant schema with ID ${schemaName} does not exist`);
        throw new HttpException(
          `Tenant with ID ${schemaName} does not exist`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Step 2: Set the tenant schema in the current database connection
      await this.setTenantSchema(schemaName);

      this.logger.log(`Tenant ${schemaName} schema found, request processed`);
    }

    // Attach the tenant ID to the request object
    req['schema'] = schemaId || 'public';

    // Move to the next middleware/handler
    next();
  }

  private async checkTenantExists(schemaId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [schemaId],
    );
    return result.length > 0;
  }

  async setTenantSchema(schemaId: string) {
    // Setting the schema for the tenant in the database connection
    await this.dataSource.query(`SET search_path TO "${schemaId}"`);
  }
}
