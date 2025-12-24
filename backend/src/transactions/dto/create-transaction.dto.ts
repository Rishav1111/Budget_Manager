import { IsString, IsNumber, IsDateString, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsIn(['income', 'expense'])
  type: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsDateString()
  date: string;
}

