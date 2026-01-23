import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto, userId: number): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId,
    });
    return this.transactionRepository.save(transaction);
  }

  findAll(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  findOne(id: number, userId: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { id, userId } });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto, userId: number): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return this.transactionRepository.save({
      ...transaction,
      ...updateTransactionDto,
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.findOne(id, userId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    await this.transactionRepository.delete(id);
  }

  async getStats(userId: number) {
    const transactions = await this.findAll(userId);
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    // Calculate monthly stats for trends
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
    
    const currentMonthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const lastMonthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(lastMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const currentMonthExpense = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const lastMonthExpense = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(lastMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const incomeChange = lastMonthIncome > 0 
      ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
      : 0;
    const expenseChange = lastMonthExpense > 0 
      ? ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 
      : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      currentMonthIncome,
      lastMonthIncome,
      currentMonthExpense,
      lastMonthExpense,
      incomeChange,
      expenseChange,
    };
  }

  async bulkDelete(ids: number[], userId: number): Promise<void> {
    // Verify all transactions belong to the user
    const transactions = await this.transactionRepository.find({
      where: ids.map((id) => ({ id, userId })),
    });
    
    if (transactions.length !== ids.length) {
      throw new Error('Some transactions not found or do not belong to user');
    }
    
    await this.transactionRepository.delete(ids);
  }

  async bulkUpdate(
    ids: number[],
    updateData: { type?: string; category?: string; date?: string },
    userId: number,
  ): Promise<Transaction[]> {
    // Verify all transactions belong to the user
    const transactions = await this.transactionRepository.find({
      where: ids.map((id) => ({ id, userId })),
    });
    
    if (transactions.length !== ids.length) {
      throw new Error('Some transactions not found or do not belong to user');
    }
    
    // Update all transactions
    const updatePromises = transactions.map((transaction) => {
      const updated = { ...transaction, ...updateData };
      return this.transactionRepository.save(updated);
    });
    
    return Promise.all(updatePromises);
  }
}

