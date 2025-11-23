import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class AppConfigRepository {
  constructor(private readonly pg: PostgresService) {}

  async getHomeConfig(zoneId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_app_config_customer',
      ['customer_home', zoneId || null],
      false
    );

    if (!result) {
      return null;
    }

    return result;
  }
}
