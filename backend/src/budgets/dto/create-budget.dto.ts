import { IsString, IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  category: string;

  @IsNumber()
  limit: number;
}

