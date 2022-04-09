import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/model/base.entity';
import { Order } from 'src/modules/orders/orders/entities/order.entity';

@Entity('customer')
export class Customer extends BaseEntity {
  @Column({ name: 'fullname', nullable: true })
  fullName: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'address', nullable: false })
  address: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
