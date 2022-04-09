import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, MoreThan, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CustomersService } from 'src/modules/customers/customers.service';

import { CreateOrderDto } from './dto/create-order.dto';

import { OrderItem } from '../order-items/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private connection: Connection,
    private customersService: CustomersService,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async create(user: any, createOrderDto: CreateOrderDto) {
    const orderNumber = await this.findOrderByDate();
    const customer = await this.customersService.findOne(
      createOrderDto.customerName,
    );

    if (!customer) {
      throw new BadRequestException('Customer name not found.');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newOrder = this.orderRepo.create();
    try {
      // generate orderNumber
      if (orderNumber.length > 0) {
        newOrder.orderNumber =
          dayjs().format('DDMMYYYY').toString() +
          (orderNumber.length + 1).toString().padStart(4, '0');
      } else {
        newOrder.orderNumber = dayjs().format('DDMMYYYY').toString() + '0001';
      }

      // calculator weightTotal
      newOrder.weightTotal = createOrderDto.orderItems.reduce(
        (previousValue, currentValue) => +previousValue + +currentValue,
        0,
      );

      // save pricePerUnit
      newOrder.pricePerUnit = createOrderDto.pricePerUnit;

      // calculator priceTotal
      newOrder.priceTotal = +(
        newOrder.weightTotal * newOrder.pricePerUnit
      ).toFixed(2);

      if (
        parseInt(
          (createOrderDto.employee + createOrderDto.employer).toFixed(2),
        ) !== newOrder.priceTotal
      ) {
        throw new BadRequestException('Cost invalid.');
      }

      // save relation
      newOrder.user = user;
      newOrder.customer = customer;
      newOrder.employer = createOrderDto.employer;
      newOrder.employee = createOrderDto.employee;

      const order = await this.orderRepo.save(newOrder);

      // map save order items
      createOrderDto.orderItems.map((v) => {
        const newOrderItems = this.orderItemRepo.create();
        newOrderItems.order = order;
        newOrderItems.weight = +v;
        this.orderItemRepo.save(newOrderItems);
      }),
        await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();
    }
  }

  async genOrderNumber(orderNumber: string) {
    return (+orderNumber + 1).toString();
  }

  async findOrderByDate() {
    const yesterday = dayjs().add(-1, 'day').format();

    return await this.orderRepo.find({
      where: {
        createdAt: MoreThan(yesterday),
      },
    });
  }

  async findOne(username: string) {
    return await this.orderRepo.findOne({ where: { email: username } });
  }

  async findAll() {
    return await this.orderRepo.find({ relations: ['orderItems'] });
  }
}
