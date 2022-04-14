import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginateOptions,
  IPaginationMeta,
  paginate,
} from 'src/utils/paginate';
import { Repository } from 'typeorm';
import { BaseQueryDto } from '../model/base-query.dto';
import { Order } from '../orders/entities/order.entity';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  async register(createCustomerDto: CreateCustomerDto) {
    const findUser = await this.findOne(createCustomerDto.phone);
    if (findUser) {
      throw new BadRequestException('There is an phone in the system.');
    }
    const user = this.customerRepo.create(createCustomerDto);
    return await this.customerRepo.save(user);
  }

  async findOne(phone: string) {
    return await this.customerRepo.findOne({ where: { phone: phone } });
  }

  async findOneByFullName(fullName: string) {
    return await this.customerRepo.findOne({ where: { fullName: fullName } });
  }

  async findOneByPhone(phone: string) {
    return await this.customerRepo.findOne({ where: { phone: phone } });
  }

  async findAll(
    options: IPaginateOptions,
    baseQueryDto: BaseQueryDto,
  ): Promise<IPaginationMeta<Customer>> {
    const customer = this.customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'order')
      .orderBy('customer.updatedAt', 'DESC');

    if (baseQueryDto.search && baseQueryDto.key) {
      customer.andWhere(`customer.${baseQueryDto.key} like :search`, {
        search: `%${baseQueryDto.search}%`,
      });
    }
    return await paginate(customer, options);
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto) {
    return await this.customerRepo.update(id, updateCustomerDto);
  }

  async findTotalCustomer() {
    const [list, count] = await this.customerRepo.findAndCount();
    return count;
  }

  async findAllOrderByCreatedAt(
    options: IPaginateOptions,
    queryCustomerDto: QueryCustomerDto,
  ): Promise<IPaginationMeta<Customer>> {
    const customer = this.customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .orderBy('orderItem.createdAt', 'DESC');

    if (queryCustomerDto.search && queryCustomerDto.key) {
      customer.andWhere(`customer.${queryCustomerDto.key} like :search`, {
        search: `%${queryCustomerDto.search}%`,
      });
    }

    if (queryCustomerDto.day) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() - 7);
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      customer.andWhere('order.createdAt BETWEEN :endDate AND :startDate', {
        startDate: startDate,
        endDate: endDate,
      });
    }
    return await paginate(customer, options);
  }
}
