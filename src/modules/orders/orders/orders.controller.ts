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

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(req.user, createOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/customer')
  async getOrder(@Query() orderQueryDto: OrderQueryDto) {
    const options = {
      page: orderQueryDto.page,
      limit: orderQueryDto.limit,
    };
    return await this.ordersService.findOrderByCustomerName(
      orderQueryDto,
      options,
    );
  }
}
