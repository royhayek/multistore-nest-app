// Domains
import { Permission } from '../domain/permission';

// Entities
import { RoleEntity } from '../../roles/entity/role.entity';
import { PermissionEntity } from '../entities/permission.entity';

export class PermissionMapper {
  static toDomain(raw: PermissionEntity): Permission {
    const domainEntity = new Permission();
    domainEntity.permission = raw.permission;

    domainEntity.id = raw.id;
    domainEntity.role = raw.role;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Permission): PermissionEntity {
    const persistenceEntity = new PermissionEntity();
    persistenceEntity.permission = domainEntity.permission;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    let role: RoleEntity | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleEntity();
      role.id = Number(domainEntity.role.id);
    }

    persistenceEntity.role = role;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
