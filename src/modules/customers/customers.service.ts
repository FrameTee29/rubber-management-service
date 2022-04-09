import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async register(createCustomerDto: CreateCustomerDto) {
    const findUser = await this.findOne(createCustomerDto.fullName);
    if (findUser) {
      throw new BadRequestException('There is an fullName in the system.');
    }
    const user = this.customerRepo.create(createCustomerDto);
    return await this.customerRepo.save(user);
  }

  async findOne(username: string) {
    return await this.customerRepo.findOne({ where: { fullName: username } });
  }

  async findAll() {
    return await this.customerRepo.find();
  }
}
