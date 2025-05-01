import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class StoreSeeder {
  async seedStoreData(
    connection: DataSource,
    schemaName: string,
  ): Promise<void> {
    // Seed role table
    await connection.query(`
      INSERT INTO ${schemaName}.role (id, name)
      VALUES 
      (1, 'Admin'),
      (2, 'Customer'),
      (3, 'Manager'),
      (4, 'Cashier'),
      (5, 'Stock Manager'),
      (6, 'Customer Service'),
      (7, 'Delivery Personnel');
    `);

    // Seed status table
    await connection.query(`
      INSERT INTO ${schemaName}.user_statuses (id, name)
      VALUES 
      (1, 'Active'),
      (2, 'Inactive');
    `);
  }
}
