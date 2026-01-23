import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Budget } from '../entities/budget.entity';

export interface Insight {
  type: 'warning' | 'info' | 'success' | 'recommendation';
  title: string;
  message: string;
  priority: number; // Higher priority = shown first
  action?: string; // Optional action suggestion
}

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  async getInsights(userId: number): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Get all transactions and budgets
    const transactions = await this.transactionRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });

    const budgets = await this.budgetRepository.find({
      where: { userId },
    });

    // Analyze spending patterns
    const spendingInsights = this.analyzeSpendingPatterns(transactions);
    insights.push(...spendingInsights);

    // Analyze budget performance
    const budgetInsights = await this.analyzeBudgets(transactions, budgets);
    insights.push(...budgetInsights);

    // Analyze savings opportunities
    const savingsInsights = this.analyzeSavingsOpportunities(transactions);
    insights.push(...savingsInsights);

    // Analyze unusual spending
    const unusualSpendingInsights = this.analyzeUnusualSpending(transactions);
    insights.push(...unusualSpendingInsights);

    // Analyze category spending
    const categoryInsights = this.analyzeCategorySpending(transactions);
    insights.push(...categoryInsights);

    // Sort by priority (highest first)
    return insights.sort((a, b) => b.priority - a.priority);
  }

  private analyzeSpendingPatterns(transactions: Transaction[]): Insight[] {
    const insights: Insight[] = [];

    if (transactions.length === 0) {
      insights.push({
        type: 'info',
        title: 'Get Started',
        message: 'Start tracking your finances by adding your first transaction!',
        priority: 1,
      });
      return insights;
    }

    // Calculate monthly trends
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .slice(0, 7);

    const currentMonthExpenses = transactions
      .filter(
        (t) => t.type === 'expense' && t.date.startsWith(currentMonth),
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(lastMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentMonthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(lastMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Spending increase warning
    if (lastMonthExpenses > 0 && currentMonthExpenses > lastMonthExpenses) {
      const increasePercent =
        ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      if (increasePercent > 20) {
        insights.push({
          type: 'warning',
          title: 'Spending Increase Detected',
          message: `Your spending increased by ${increasePercent.toFixed(
            1,
          )}% compared to last month. Consider reviewing your expenses.`,
          priority: 8,
          action: 'Review your transactions',
        });
      }
    }

    // Income decrease warning
    if (lastMonthIncome > 0 && currentMonthIncome < lastMonthIncome) {
      const decreasePercent =
        ((lastMonthIncome - currentMonthIncome) / lastMonthIncome) * 100;
      if (decreasePercent > 15) {
        insights.push({
          type: 'warning',
          title: 'Income Decrease',
          message: `Your income decreased by ${decreasePercent.toFixed(
            1,
          )}% this month. Adjust your spending accordingly.`,
          priority: 9,
        });
      }
    }

    // Positive spending reduction
    if (
      lastMonthExpenses > 0 &&
      currentMonthExpenses < lastMonthExpenses &&
      currentMonthExpenses > 0
    ) {
      const decreasePercent =
        ((lastMonthExpenses - currentMonthExpenses) / lastMonthExpenses) * 100;
      if (decreasePercent > 10) {
        insights.push({
          type: 'success',
          title: 'Great Job!',
          message: `You've reduced your spending by ${decreasePercent.toFixed(
            1,
          )}% compared to last month. Keep it up!`,
          priority: 7,
        });
      }
    }

    return insights;
  }

  private async analyzeBudgets(
    transactions: Transaction[],
    budgets: Budget[],
  ): Promise<Insight[]> {
    const insights: Insight[] = [];

    if (budgets.length === 0) {
      insights.push({
        type: 'recommendation',
        title: 'Set Budget Limits',
        message:
          'Create budget limits for your expense categories to track your spending better.',
        priority: 6,
        action: 'Add a budget',
      });
      return insights;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    for (const budget of budgets) {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            t.date.startsWith(currentMonth),
        )
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const percentage = (spent / Number(budget.limit)) * 100;

      // Budget exceeded
      if (percentage > 100) {
        insights.push({
          type: 'warning',
          title: `Budget Exceeded: ${budget.category}`,
          message: `You've exceeded your ${budget.category} budget by ${(
            spent - Number(budget.limit)
          ).toFixed(2)}. Consider reducing spending in this category.`,
          priority: 10,
        });
      }
      // Budget nearly exceeded (80-100%)
      else if (percentage >= 80) {
        insights.push({
          type: 'warning',
          title: `Budget Alert: ${budget.category}`,
          message: `You've used ${percentage.toFixed(
            1,
          )}% of your ${budget.category} budget. Only ${(
            Number(budget.limit) - spent
          ).toFixed(2)} remaining.`,
          priority: 8,
        });
      }
      // Budget well managed (< 50%)
      else if (percentage < 50 && spent > 0) {
        insights.push({
          type: 'success',
          title: `Budget On Track: ${budget.category}`,
          message: `Great job managing your ${budget.category} budget! You've only used ${percentage.toFixed(
            1,
          )}% so far.`,
          priority: 3,
        });
      }
    }

    return insights;
  }

  private analyzeSavingsOpportunities(transactions: Transaction[]): Insight[] {
    const insights: Insight[] = [];

    const expenses = transactions.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return insights;

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = expenses.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    const savingsRate = totalIncome > 0 ? (1 - totalExpense / totalIncome) * 100 : 0;

    // Low savings rate warning
    if (totalIncome > 0 && savingsRate < 10 && savingsRate >= 0) {
      insights.push({
        type: 'recommendation',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(
          1,
        )}%. Financial experts recommend saving at least 20% of your income.`,
        priority: 7,
        action: 'Review your expenses',
      });
    }

    // Negative savings (spending more than income)
    if (totalExpense > totalIncome && totalIncome > 0) {
      const overspend = totalExpense - totalIncome;
      insights.push({
        type: 'warning',
        title: 'Overspending Alert',
        message: `You're spending ${overspend.toFixed(
          2,
        )} more than your income. This is not sustainable long-term.`,
        priority: 10,
        action: 'Reduce expenses',
      });
    }

    // Good savings rate
    if (savingsRate >= 20 && totalIncome > 0) {
      insights.push({
        type: 'success',
        title: 'Excellent Savings Rate!',
        message: `You're saving ${savingsRate.toFixed(
          1,
        )}% of your income. Keep up the great work!`,
        priority: 5,
      });
    }

    // Find top spending categories
    const categorySpending: { [key: string]: number } = {};
    expenses.forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + Number(t.amount);
    });

    const topCategory = Object.entries(categorySpending).sort(
      (a, b) => b[1] - a[1],
    )[0];

    if (topCategory && topCategory[1] > totalExpense * 0.3) {
      insights.push({
        type: 'recommendation',
        title: 'Top Spending Category',
        message: `${topCategory[0]} accounts for ${(
          (topCategory[1] / totalExpense) *
          100
        ).toFixed(1)}% of your expenses. Consider if there are ways to optimize spending in this category.`,
        priority: 6,
      });
    }

    return insights;
  }

  private analyzeUnusualSpending(transactions: Transaction[]): Insight[] {
    const insights: Insight[] = [];

    const expenses = transactions.filter((t) => t.type === 'expense');
    if (expenses.length < 5) return insights; // Need enough data

    // Calculate average transaction amount
    const amounts = expenses.map((t) => Number(t.amount));
    const avgAmount =
      amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    const stdDev = Math.sqrt(
      amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) /
        amounts.length,
    );

    // Find unusually large transactions (more than 2 standard deviations)
    const threshold = avgAmount + 2 * stdDev;
    const largeTransactions = expenses.filter(
      (t) => Number(t.amount) > threshold,
    );

    if (largeTransactions.length > 0) {
      const largest = largeTransactions.sort(
        (a, b) => Number(b.amount) - Number(a.amount),
      )[0];

      insights.push({
        type: 'info',
        title: 'Unusual Transaction Detected',
        message: `You have a transaction of ${Number(
          largest.amount,
        ).toFixed(2)} for "${largest.description}" which is significantly higher than your average.`,
        priority: 4,
      });
    }

    return insights;
  }

  private analyzeCategorySpending(transactions: Transaction[]): Insight[] {
    const insights: Insight[] = [];

    const expenses = transactions.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return insights;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .slice(0, 7);

    // Compare category spending month-over-month
    const currentMonthByCategory: { [key: string]: number } = {};
    const lastMonthByCategory: { [key: string]: number } = {};

    expenses.forEach((t) => {
      if (t.date.startsWith(currentMonth)) {
        currentMonthByCategory[t.category] =
          (currentMonthByCategory[t.category] || 0) + Number(t.amount);
      }
      if (t.date.startsWith(lastMonth)) {
        lastMonthByCategory[t.category] =
          (lastMonthByCategory[t.category] || 0) + Number(t.amount);
      }
    });

    // Find categories with significant increases
    for (const category in currentMonthByCategory) {
      const current = currentMonthByCategory[category];
      const last = lastMonthByCategory[category] || 0;

      if (last > 0 && current > last * 1.5) {
        const increasePercent = ((current - last) / last) * 100;
        insights.push({
          type: 'info',
          title: `Increased Spending: ${category}`,
          message: `Your ${category} spending increased by ${increasePercent.toFixed(
            1,
          )}% compared to last month.`,
          priority: 5,
        });
      }
    }

    return insights;
  }
}
