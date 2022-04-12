import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/modules/model/base.entity';
import { Order } from './order.entity';

@Entity('order-item')
export class OrderItem extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  weight: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;
}
