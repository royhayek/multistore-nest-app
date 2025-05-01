import { Store } from '../domain/store';
import { StoreEntity } from '../entities/store.entity';

export class StoreMapper {
  static toDomain(raw: StoreEntity): Store {
    const domainEntity = new Store();
    domainEntity.schemaId = raw.schemaId;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.isActive = raw.isActive;
    domainEntity.domain = raw.domain;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Store): StoreEntity {
    const persistenceEntity = new StoreEntity();

    if (domainEntity.schemaId) {
      persistenceEntity.schemaId = domainEntity.schemaId;
    }

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.isActive = domainEntity.isActive;
    persistenceEntity.domain = domainEntity.domain;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
