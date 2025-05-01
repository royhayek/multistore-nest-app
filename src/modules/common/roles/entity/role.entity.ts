import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../utils/types/relational-entity-helper';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
