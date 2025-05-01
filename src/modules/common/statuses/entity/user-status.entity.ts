import { EntityRelationalHelper } from '../../../../utils/types/relational-entity-helper';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_statuses' })
export class UserStatusEntity extends EntityRelationalHelper {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
