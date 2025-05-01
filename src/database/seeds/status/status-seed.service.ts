import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserStatusEnum } from '@/modules/common/statuses/user-statuses.enum';

@Injectable()
export class StatusSeedService {
  async run(dataSource: DataSource, schemaName: string) {
    const statuses = [
      { id: UserStatusEnum.active, name: 'Active' },
      { id: UserStatusEnum.inactive, name: 'Inactive' },
    ];

    for (const status of statuses) {
      const existingStatus = await dataSource.query(
        `SELECT * FROM "${schemaName}".user_statuses WHERE id = $1`,
        [status.id],
      );

      if (existingStatus.length === 0) {
        await dataSource.query(
          `INSERT INTO "${schemaName}".user_statuses (id, name) VALUES ($1, $2)`,
          [status.id, status.name],
        );
        console.log(`Seeded status: ${status.name}`);
      }
    }
  }
}
