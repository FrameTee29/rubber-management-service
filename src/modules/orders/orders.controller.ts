import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrderQueryDto } from './dto/query-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('orders/create')
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(req.user, createOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  async findAll(@Query() orderQueryDto: OrderQueryDto) {
    const options = {
      page: orderQueryDto.page,
      limit: orderQueryDto.limit,
    };
    return await this.ordersService.findAll(orderQueryDto, options);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders/customer')
  async getOrderByCustomerPhone(@Query() orderQueryDto: OrderQueryDto) {
    const options = {
      page: orderQueryDto.page,
      limit: orderQueryDto.limit,
    };
    return await this.ordersService.findOrderByCustomerPhone(
      orderQueryDto,
      options,
    );
  }

  @Get('chart')
  findTotalExpenses() {
    return this.ordersService.findTotalExpenses();
  }
}
