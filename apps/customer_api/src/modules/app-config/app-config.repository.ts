import { Injectable } from '@nestjs/common';
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
}
