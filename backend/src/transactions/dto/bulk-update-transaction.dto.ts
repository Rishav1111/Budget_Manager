import { IsArray, IsNumber, IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class BulkUpdateTransactionDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @IsOptional()
  @IsString()
  @IsIn(['income', 'expense'])
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
