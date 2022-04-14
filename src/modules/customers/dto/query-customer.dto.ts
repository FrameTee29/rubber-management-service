import { IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/modules/model/base-query.dto';

export class QueryCustomerDto extends BaseQueryDto {
  @IsOptional()
  phone: string;
  @IsOptional()
  start: string;
  @IsOptional()
  end: string;
  @IsOptional()
  year: string;
  @IsOptional()
  day: string;
}
