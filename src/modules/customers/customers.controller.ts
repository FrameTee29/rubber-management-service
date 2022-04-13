import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';

import { CustomersService } from './customers.service';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { BaseQueryDto } from '../model/base-query.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.register(createCustomerDto);
  }

  @Get()
  findAll(@Query() baseQueryDto: BaseQueryDto) {
    const options = {
      page: baseQueryDto.page,
      limit: baseQueryDto.limit,
    };
    return this.customerService.findAll(options);
  }
}
