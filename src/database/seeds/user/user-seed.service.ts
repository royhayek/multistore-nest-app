import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import {
  PublicRoleEnum,
  StoreRoleEnum,
} from '@/modules/common/roles/roles.enum';
import { UserStatusEnum } from '@/modules/common/statuses/user-statuses.enum';

@Injectable()
export class UserSeedService {
  async run(dataSource: DataSource, schemaName: string) {
    const isPublicSchema = schemaName === 'public';

    // Check if an admin user exists
    const adminExists = await dataSource.query(
      `SELECT COUNT(*) FROM "${schemaName}"."users" WHERE "roleId" = $1`,
      [isPublicSchema ? PublicRoleEnum.superAdmin : StoreRoleEnum.storeOwner],
    );

    if (parseInt(adminExists[0].count, 10) === 0) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      // Insert admin user
      await dataSource.query(
        `
        INSERT INTO "${schemaName}"."users" ("firstName", "lastName", "email", "password", "phoneNumber", "roleId", "statusId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          'Super',
          'Admin',
          'admin1@test.com',
          password,
          '+9611234567',
          isPublicSchema ? PublicRoleEnum.superAdmin : StoreRoleEnum.storeOwner,
          UserStatusEnum.active,
        ],
      );
    }
  }
}
