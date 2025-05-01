import { DeepPartial } from '@/utils/types/deep-partial.type';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { Store } from '../domain/store';

export abstract class IStoreRepository {
  abstract create(
    data: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Store>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Store[]>;

  abstract findById(id: Store['id']): Promise<NullableType<Store>>;

  abstract findByIds(ids: Store['id'][]): Promise<Store[]>;

  abstract update(
    id: Store['id'],
    payload: DeepPartial<Store>,
  ): Promise<Store | null>;

  abstract remove(id: Store['id']): Promise<void>;

  abstract findStoreByUserEmail(email: string): Promise<Store>;
}
