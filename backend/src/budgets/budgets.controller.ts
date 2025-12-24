import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(
    @Body() createBudgetDto: CreateBudgetDto,
    @CurrentUser() user: any,
  ) {
    return this.budgetsService.create(createBudgetDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.budgetsService.findAll(user.userId);
  }

  @Get('with-spending')
  getBudgetWithSpending(@CurrentUser() user: any) {
    return this.budgetsService.getBudgetWithSpending(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.budgetsService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @CurrentUser() user: any,
  ) {
    return this.budgetsService.update(+id, updateBudgetDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.budgetsService.remove(+id, user.userId);
  }
}

