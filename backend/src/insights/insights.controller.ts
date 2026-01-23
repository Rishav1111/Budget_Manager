import { Controller, Get, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getInsights(@CurrentUser() user: any) {
    return this.insightsService.getInsights(user.userId);
  }
}
