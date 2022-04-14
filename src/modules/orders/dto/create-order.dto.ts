import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

import { OrderItemDto } from './order-items.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  pricePerUnit: number;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @Type(() => OrderItemDto)
  @IsArray()
  orderItems: OrderItemDto[];

  @IsOptional()
  employer: number;

  @IsOptional()
  employee: number;
}
