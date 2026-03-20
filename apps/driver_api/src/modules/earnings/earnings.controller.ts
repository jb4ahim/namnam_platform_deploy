import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { EarningsService } from './earnings.service';
import { EarningsSummaryDto } from './dto/earnings-response.dto';

@ApiTags('Earnings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Get()
  @ApiOperation({ summary: 'Get earnings summary for a period' })
  @ApiQuery({ name: 'period', required: false, enum: ['today', 'week', 'month'], description: 'Earnings period (default: today)' })
  @ApiResponse({ status: 200, description: 'Earnings summary.', type: EarningsSummaryDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSummary(@Request() req: any, @Query('period') period?: string) {
    const validPeriod = (['today', 'week', 'month'].includes(period ?? '') ? period : 'today') as 'today' | 'week' | 'month';
    return this.earningsService.getSummary(req.user.userId, validPeriod);
  }
}
