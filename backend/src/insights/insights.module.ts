import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { Transaction } from '../entities/transaction.entity';
import { Budget } from '../entities/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Budget])],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
