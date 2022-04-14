import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Patch,
  Param,
} from '@nestjs/common';

import { CustomersService } from './customers.service';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { BaseQueryDto } from '../model/base-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

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
    return this.customerService.findAll(options, baseQueryDto);
  }

  @Get('summary')
  findAllOrderByCreatedAt(@Query() queryCustomerDto: QueryCustomerDto) {
    return this.customerService.findAllOrderByCreatedAt(queryCustomerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  updateCustomer(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }
}
