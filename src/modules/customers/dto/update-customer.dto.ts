import { IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  fullName: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;
}
