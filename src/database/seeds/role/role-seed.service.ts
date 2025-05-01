import { Injectable } from '@nestjs/common';
import {
  PublicRoleEnum,
  StoreRoleEnum,
} from '@/modules/common/roles/roles.enum';
import { RoleEntity } from '@/modules/common/roles/entity/role.entity';
import { BaseRepository } from '@/common/base-repository';
import { DataSourceContext } from '@/common/data-source.context';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleSeedService extends BaseRepository<RoleEntity> {
  constructor(dataSourceContext: DataSourceContext) {
    super(dataSourceContext, RoleEntity);
  }

  async run(
    dataSource: DataSource,
    schemaName: string,
    type: string = 'owner',
  ) {
    const roles =
      type === 'owner'
        ? [
            { id: PublicRoleEnum.superAdmin, name: 'Super Admin' },
            { id: PublicRoleEnum.admin, name: 'Admin' },
          ]
        : [
            { id: StoreRoleEnum.storeOwner, name: 'Store Owner' },
            { id: StoreRoleEnum.customer, name: 'Customer' },
            { id: StoreRoleEnum.manager, name: 'Manager' },
            { id: StoreRoleEnum.cashier, name: 'Cashier' },
            { id: StoreRoleEnum.stockManager, name: 'Stock Manager' },
            { id: StoreRoleEnum.customerService, name: 'Customer Service' },
            { id: StoreRoleEnum.deliveryPersonnel, name: 'Delivery Personnel' },
          ];

    for (const role of roles) {
      const existingRole = await dataSource.query(
        `SELECT * FROM "${schemaName}".role WHERE id = $1`,
        [role.id],
      );

      if (existingRole.length === 0) {
        await dataSource.query(
          `INSERT INTO "${schemaName}".role (id, name) VALUES ($1, $2)`,
          [role.id, role.name],
        );
        console.log(`Seeded role: ${role.name}`);
      }
    }
  }
}
