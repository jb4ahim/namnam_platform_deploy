import { Injectable } from '@nestjs/common';
import { AppConfigDto } from './dto/app-config.dto';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class AppConfigRepository {
  constructor(private readonly pg: PostgresService) {}

  async getHomeConfig() {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_app_config',
      ['customer_home'],
      false
    );

    if (!result) {
      return null;
    }

    return result;
  }

  async updateHomeConfig(config: AppConfigDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'upsert_app_config',
      ['customer_home', JSON.stringify(config)]
    );

    return { key: 'customer_home', value: config };
  }
}
