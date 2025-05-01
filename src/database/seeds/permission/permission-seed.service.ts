import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  PublicPermissionEnum,
  StorePermissionEnum,
} from '@/modules/common/permissions/permissins.enum';
import {
  PublicRoleEnum,
  StoreRoleEnum,
} from '@/modules/common/roles/roles.enum';

@Injectable()
export class PermissionSeedService {
  async run(
    dataSource: DataSource,
    schemaName: string,
    type: string = 'owner',
  ) {
    const permissions =
      type === 'owner'
        ? [
            // Super Admin and Admin permissions
            {
              permission: PublicPermissionEnum.MANAGE_ROLES,
              roleId: PublicRoleEnum.superAdmin,
            },
            {
              permission: PublicPermissionEnum.MANAGE_PERMISSIONS,
              roleId: PublicRoleEnum.superAdmin,
            },
            {
              permission: PublicPermissionEnum.VIEW_REPORTS,
              roleId: PublicRoleEnum.superAdmin,
            },
            {
              permission: PublicPermissionEnum.CONFIGURE_SETTINGS,
              roleId: PublicRoleEnum.superAdmin,
            },
            {
              permission: PublicPermissionEnum.MANAGE_TENANTS,
              roleId: PublicRoleEnum.superAdmin,
            },
            {
              permission: PublicPermissionEnum.VIEW_SYSTEM_LOGS,
              roleId: PublicRoleEnum.superAdmin,
            },
          ]
        : [
            // Manager permissions
            {
              permission: StorePermissionEnum.MANAGE_INVENTORY,
              roleId: StoreRoleEnum.manager,
            },
            {
              permission: StorePermissionEnum.APPROVE_DISCOUNTS,
              roleId: StoreRoleEnum.manager,
            },
            {
              permission: StorePermissionEnum.VIEW_SALES_DATA,
              roleId: StoreRoleEnum.manager,
            },
            {
              permission: StorePermissionEnum.ASSIGN_TASKS,
              roleId: StoreRoleEnum.manager,
            },

            // Cashier permissions
            {
              permission: StorePermissionEnum.PROCESS_SALES,
              roleId: StoreRoleEnum.cashier,
            },
            {
              permission: StorePermissionEnum.ISSUE_REFUNDS,
              roleId: StoreRoleEnum.cashier,
            },
            {
              permission: StorePermissionEnum.HANDLE_CASH,
              roleId: StoreRoleEnum.cashier,
            },

            // Stock Manager permissions
            {
              permission: StorePermissionEnum.MANAGE_STOCK,
              roleId: StoreRoleEnum.stockManager,
            },
            {
              permission: StorePermissionEnum.TRACK_INVENTORY,
              roleId: StoreRoleEnum.stockManager,
            },
            {
              permission: StorePermissionEnum.GENERATE_REORDER_REQUESTS,
              roleId: StoreRoleEnum.stockManager,
            },

            // Customer Service permissions
            {
              permission: StorePermissionEnum.HANDLE_QUERIES,
              roleId: StoreRoleEnum.customerService,
            },
            {
              permission: StorePermissionEnum.PROCESS_RETURNS,
              roleId: StoreRoleEnum.customerService,
            },
            {
              permission: StorePermissionEnum.ISSUE_DISCOUNTS,
              roleId: StoreRoleEnum.customerService,
            },

            // Delivery Personnel permissions
            {
              permission: StorePermissionEnum.UPDATE_DELIVERY_STATUS,
              roleId: StoreRoleEnum.deliveryPersonnel,
            },
            {
              permission: StorePermissionEnum.VIEW_ASSIGNED_ORDERS,
              roleId: StoreRoleEnum.deliveryPersonnel,
            },
            {
              permission: StorePermissionEnum.MARK_ORDER_COMPLETED,
              roleId: StoreRoleEnum.deliveryPersonnel,
            },
            {
              permission: StorePermissionEnum.ACCESS_ROUTE_DETAILS,
              roleId: StoreRoleEnum.deliveryPersonnel,
            },
          ];

    for (const permission of permissions) {
      const existingPermission = await dataSource.query(
        `SELECT * FROM "${schemaName}".permission WHERE "permission" = $1`,
        [permission.permission],
      );

      if (existingPermission.length === 0) {
        await dataSource.query(
          `INSERT INTO "${schemaName}".permission ("permission", "roleId") VALUES ($1, $2)`,
          [permission.permission, permission.roleId],
        );
        console.log(`Seeded permission: ${permission.permission}`);
      }
    }
  }
}
