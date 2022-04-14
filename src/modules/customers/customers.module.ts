import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersService } from './customers.service';

import { CustomersController } from './customers.controller';

import { Customer } from './entities/customer.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Order])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomerModule {}
