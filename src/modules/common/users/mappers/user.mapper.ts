// Domains
import { User } from '../domain/user';

// Entities
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../../roles/entity/role.entity';
import { UserStatusEntity } from '../../statuses/entity/user-status.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.phoneNumber = raw.phoneNumber;

    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.role = raw.role;
    domainEntity.roleId = raw.role?.id;
    domainEntity.status = raw.status;
    domainEntity.statusId = raw.status?.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    let role: RoleEntity | undefined = undefined;

    if (domainEntity.roleId) {
      role = new RoleEntity();
      role.id = Number(domainEntity.roleId);
    }

    let status: UserStatusEntity | undefined = undefined;

    if (domainEntity.statusId) {
      status = new UserStatusEntity();
      status.id = Number(domainEntity.statusId);
    }

    const persistenceEntity = new UserEntity();
    persistenceEntity.phoneNumber = domainEntity.phoneNumber;

    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.role = role;
    persistenceEntity.status = status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
