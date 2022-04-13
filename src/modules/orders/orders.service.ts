import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, MoreThan, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CustomersService } from 'src/modules/customers/customers.service';

import { CreateOrderDto } from './dto/create-order.dto';

import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderQueryDto } from './dto/query-order.dto';
import {
  IPaginateOptions,
  IPaginationMeta,
  paginate,
} from 'src/utils/paginate';

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
    newOrder.priceTotal = Math.floor(
      newOrder.weightTotal * newOrder.pricePerUnit,
    );

    if (
      Math.floor(createOrderDto.employee + createOrderDto.employer) !==
      newOrder.priceTotal
    ) {
      throw new BadRequestException('Cost invalid.');
    }

    // save relation
    newOrder.user = user;
    newOrder.customer = customer;
    newOrder.employer = createOrderDto.employer;
    newOrder.employee = createOrderDto.employee;

    try {
      const order = await this.orderRepo.save(newOrder);
      // map save order items
      createOrderDto.orderItems.map((v) => {
        const newOrderItems = this.orderItemRepo.create();
        newOrderItems.order = order;
        newOrderItems.weight = +v;
        this.orderItemRepo.save(newOrderItems);
      }),
        await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    }
    return newOrder;
  }

  async findOrderByDate() {
    const yesterday = dayjs().add(-1, 'day').format();

    return await this.orderRepo.find({
      where: {
        createdAt: MoreThan(yesterday),
      },
    });
  }

  async findAll() {
    return await this.orderRepo.find({ relations: ['orderItems'] });
  }

  async findOrderByCustomerPhone(
    orderQueryDto: OrderQueryDto,
    options: IPaginateOptions,
  ): Promise<IPaginationMeta<Order>> {
    const orders = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'users')
      .leftJoinAndSelect('order.customer', 'customers');

    if (orderQueryDto.fullName) {
      orders.where('customers.fullName = :fullName', {
        fullName: orderQueryDto.fullName,
      });
    }

    return await paginate(orders, options);
  }

  async findTotalExpenses() {
    const { priceTotal } = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.priceTotal)', 'priceTotal')
      .getRawOne();

    const { weightTotal } = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.weightTotal)', 'weightTotal')
      .getRawOne();

    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const currentOrder = await this.orderRepo
      .createQueryBuilder('orders')
      .where('orders.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      })
      .getManyAndCount();

    const totalOrder = await this.orderRepo
      .createQueryBuilder('orders')
      .getCount();

    return {
      priceTotal,
      weightTotal,
      currentOrder: currentOrder.length,
      totalOrder,
    };
  }
}
