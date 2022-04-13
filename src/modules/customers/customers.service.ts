import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginateOptions,
  IPaginationMeta,
  paginate,
} from 'src/utils/paginate';
import { Repository } from 'typeorm';
import { BaseQueryDto } from '../model/base-query.dto';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
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
}
