import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';

import { CustomersService } from './customers.service';

import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.register(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }
}
