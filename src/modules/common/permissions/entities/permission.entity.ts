// Libraries
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

// Utilities
import { EntityRelationalHelper } from '../../../../utils/types/relational-entity-helper';
import { RoleEntity } from '../../roles/entity/role.entity';

@Entity({
  name: 'permission',
})
export class PermissionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: String,
  })
  permission: string;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
