import { EntityRelationalHelper } from '../../../../utils/types/relational-entity-helper';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from '../../roles/entity/role.entity';
import { UserStatusEntity } from '../../statuses/entity/user-status.entity';

@Entity({ name: 'users' })
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ type: String })
  phoneNumber: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'int', default: 1 })
  roleId: number;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role?: RoleEntity | null;

  @Column({ type: 'int', default: 1 })
  statusId: number;

  @ManyToOne(() => UserStatusEntity, { eager: true })
  @JoinColumn({ name: 'statusId' })
  status?: UserStatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
