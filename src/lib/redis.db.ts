/* eslint-disable no-console, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import { BaseRedisStorage } from './redis-base.db';
import { User } from './types';

export class RedisStorage extends BaseRedisStorage {
  constructor() {
    const config = {
      url: process.env.REDIS_URL!,
      clientName: 'Redis',
    };
    const globalSymbol = Symbol.for('__MOONTV_REDIS_CLIENT__');
    super(config, globalSymbol);
  }

  async getUser(userName: string): Promise<User | null> {
    return null;
  }
}
