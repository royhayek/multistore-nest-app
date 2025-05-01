import { Column } from 'typeorm';

export class StoreOwner {
  @Column({
    nullable: false,
    type: String,
  })
  firstName: string;

  @Column({
    nullable: false,
    type: String,
  })
  lastName: string;

  @Column({
    nullable: false,
    type: String,
  })
  email: string;

  @Column({
    nullable: false,
    type: String,
  })
  password: string;
}
