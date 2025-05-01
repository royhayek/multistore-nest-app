import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../utils/types/relational-entity-helper';

@Entity({ name: 'store' })
export class StoreEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  name: string;

  @Column({
    unique: true,
    type: 'varchar',
  })
  domain: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false, // Remove "?" from schemaId property if not nullable
  })
  schemaId: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
