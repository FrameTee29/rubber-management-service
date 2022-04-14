import { IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/modules/model/base-query.dto';

export class QueryCustomerDto extends BaseQueryDto {
  @IsOptional()
  day: string;

  @IsOptional()
  month: string;

  @IsOptional()
  year: string;
}
