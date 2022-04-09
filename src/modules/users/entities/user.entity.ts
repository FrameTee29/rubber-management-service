import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/model/base.entity';
import { Order } from 'src/modules/orders/orders/entities/order.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;

  @Column({ name: 'firstname', nullable: true })
  firstName: string;

  @Column({ name: 'lastname', nullable: true })
  lastName: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
