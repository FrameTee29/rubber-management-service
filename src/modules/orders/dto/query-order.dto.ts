import { IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/modules/model/base-query.dto';

export class OrderQueryDto extends BaseQueryDto {
  @IsOptional()
  fullName: number;
}
