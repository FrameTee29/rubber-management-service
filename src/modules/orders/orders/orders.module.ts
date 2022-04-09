import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';

import { OrdersController } from './orders.controller';

import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { CustomersService } from 'src/modules/customers/customers.service';
import { Customer } from 'src/modules/customers/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Customer])],
  controllers: [OrdersController],
  providers: [OrdersService, CustomersService],
})
export class OrdersModule {}
