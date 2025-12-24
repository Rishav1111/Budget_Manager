import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { Transaction } from '../entities/transaction.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(createBudgetDto: CreateBudgetDto, userId: number): Promise<Budget> {
    return this.budgetRepository.save({
      ...createBudgetDto,
      userId,
    });
  }

  findAll(userId: number): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { userId },
    });
  }

  findOne(id: number, userId: number): Promise<Budget | null> {
    return this.budgetRepository.findOne({ where: { id, userId } });
  }

  findByCategory(category: string, userId: number): Promise<Budget | null> {
    return this.budgetRepository.findOne({ where: { category, userId } });
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto, userId: number): Promise<Budget> {
    const budget = await this.findOne(id, userId);
    if (!budget) {
      throw new Error(`Budget with id ${id} not found`);
    }
    await this.budgetRepository.update(id, updateBudgetDto);
    return this.findOne(id, userId) as Promise<Budget>;
  }

  async remove(id: number, userId: number): Promise<void> {
    const budget = await this.findOne(id, userId);
    if (!budget) {
      throw new Error(`Budget with id ${id} not found`);
    }
    await this.budgetRepository.delete(id);
  }

  async getBudgetWithSpending(userId: number) {
    const budgets = await this.findAll(userId);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthTransactions = await this.transactionRepository.find({
      where: {
        type: 'expense',
        userId,
      },
    });

    return budgets.map((budget) => {
      const spent = monthTransactions
        .filter(
          (t) =>
            t.category === budget.category &&
            t.date.startsWith(currentMonth),
        )
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const percentage = (spent / Number(budget.limit)) * 100;

      return {
        ...budget,
        spent,
        percentage,
      };
    });
  }
}

