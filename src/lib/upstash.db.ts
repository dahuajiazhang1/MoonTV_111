/* eslint-disable no-console, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import { Redis } from '@upstash/redis';

import { AdminConfig } from './admin.types';
import { Favorite, IStorage, PlayRecord, SkipConfig } from './types';

// 搜索历史最大条数
const SEARCH_HISTORY_LIMIT = 20;

// 数据类型转换辅助函数
function ensureString(value: any): string {
  return String(value);
}

function ensureStringArray(value: any[]): string[] {
  return value.map((item) => String(item));
}

// 添加Upstash Redis操作重试包装器
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (err: any) {
      const isLastAttempt = i === maxRetries - 1;
      const isConnectionError =
        err.message?.includes('Connection') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('ENOTFOUND') ||
        err.code === 'ECONNRESET' ||
        err.code === 'EPIPE' ||
        err.name === 'UpstashError';

      if (isConnectionError && !isLastAttempt) {
        console.log(
          `Upstash Redis operation failed, retrying... (${i + 1}/${maxRetries})`
        );
        console.error('Error:', err.message);

        // 等待一段时间后重试
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      throw err;
    }
  }

  throw new Error('Max retries exceeded');
}

export class UpstashRedisStorage implements IStorage {
  private client: Redis;

  constructor() {
    this.client = getUpstashRedisClient();
  }

  // ---------- 播放记录 ----------
  private prKey(user: string, key: string) {
    return `u:${user}:pr:${key}`; // u:username:pr:source+id
  }

  async getPlayRecord(
    userName: string,
    key: string
  ): Promise<PlayRecord | null> {
    const val = await withRetry(() =>
      this.client.get(this.prKey(userName, key))
    );
    return val ? (val as PlayRecord) : null;
  }

  async setPlayRecord(
    userName: string,
    key: string,
    record: PlayRecord
  ): Promise<void> {
    // 删除同名的旧记录
    if (record.title) {
      const pattern = `u:${userName}:pr:*`;
      const allKeys: string[] = await withRetry(() => this.client.keys(pattern));

      for (const fullKey of allKeys) {
        const val = await withRetry(() => this.client.get(fullKey));
        if (val) {
          const existingRecord = val as PlayRecord;
          // 如果找到同名但不是当前key的记录，则删除它
          if (existingRecord.title === record.title && fullKey !== this.prKey(userName, key)) {
            await withRetry(() => this.client.del(fullKey));
          }
        }
      }
    }

    await withRetry(() => this.client.set(this.prKey(userName, key), record));
  }

  async getAllPlayRecords(
    userName: string
  ): Promise<Record<string, PlayRecord>> {
    const pattern = `u:${userName}:pr:*`;
    const keys: string[] = await withRetry(() => this.client.keys(pattern));
    if (keys.length === 0) return {};

    const result: Record<string, PlayRecord> = {};
    for (const fullKey of keys) {
      const value = await withRetry(() => this.client.get(fullKey));
      if (value) {
        // 截取 source+id 部分
        const keyPart = ensureString(fullKey.replace(`u:${userName}:pr:`, ''));
        result[keyPart] = value as PlayRecord;
      }
    }
    return result;
  }

  async deletePlayRecord(userName: string, key: string): Promise<void> {
    await withRetry(() => this.client.del(this.prKey(userName, key)));
  }

  // ---------- 收藏 ----------
  private favKey(user: string, key: string) {
    return `u:${user}:fav:${key}`;
  }

  async getFavorite(userName: string, key: string): Promise<Favorite | null> {
    const val = await withRetry(() =>
      this.client.get(this.favKey(userName, key))
    );
    return val ? (val as Favorite) : null;
  }

  async setFavorite(
    userName: string,
    key: string,
    favorite: Favorite
  ): Promise<void> {
    await withRetry(() =>
      this.client.set(this.favKey(userName, key), favorite)
    );
  }

  async getAllFavorites(userName: string): Promise<Record<string, Favorite>> {
    const pattern = `u:${userName}:fav:*`;
    const keys: string[] = await withRetry(() => this.client.keys(pattern));
    if (keys.length === 0) return {};

    const result: Record<string, Favorite> = {};
    for (const fullKey of keys) {
      const value = await withRetry(() => this.client.get(fullKey));
      if (value) {
        const keyPart = ensureString(fullKey.replace(`u:${userName}:fav:`, ''));
        result[keyPart] = value as Favorite;
      }
    }
    return result;
  }

  async deleteFavorite(userName: string, key: string): Promise<void> {
    await withRetry(() => this.client.del(this.favKey(userName, key)));
  }

  // ---------- 用户注册 / 登录 ----------
  private userPwdKey(user: string) {
    return `u:${user}:pwd`;
  }

  async registerUser(userName: string, password: string): Promise<void> {
    // 简单存储明文密码，生产环境应加密
    await withRetry(() => this.client.set(this.userPwdKey(userName), password));
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    const stored = await withRetry(() =>
      this.client.get(this.userPwdKey(userName))
    );
    if (stored === null) return false;
    // 确保比较时都是字符串类型
    return ensureString(stored) === password;
  }

  // 检查用户是否存在
  async checkUserExist(userName: string): Promise<boolean> {
    // 使用 EXISTS 判断 key 是否存在
    const exists = await withRetry(() =>
      this.client.exists(this.userPwdKey(userName))
    );
    return exists === 1;
  }

  // 修改用户密码
  async changePassword(userName: string, newPassword: string): Promise<void> {
    // 简单存储明文密码，生产环境应加密
    await withRetry(() =>
      this.client.set(this.userPwdKey(userName), newPassword)
    );
  }

  // 删除用户及其所有数据
  async deleteUser(userName: string): Promise<void> {
    // 删除用户密码
    await withRetry(() => this.client.del(this.userPwdKey(userName)));

    // 删除搜索历史
    await withRetry(() => this.client.del(this.shKey(userName)));

    // 删除播放记录
    const playRecordPattern = `u:${userName}:pr:*`;
    const playRecordKeys = await withRetry(() =>
      this.client.keys(playRecordPattern)
    );
    if (playRecordKeys.length > 0) {
      await withRetry(() => this.client.del(...playRecordKeys));
    }

    // 删除收藏夹
    const favoritePattern = `u:${userName}:fav:*`;
    const favoriteKeys = await withRetry(() =>
      this.client.keys(favoritePattern)
    );
    if (favoriteKeys.length > 0) {
      await withRetry(() => this.client.del(...favoriteKeys));
    }

    // 删除跳过片头片尾配置
    const skipConfigPattern = `u:${userName}:skip:*`;
    const skipConfigKeys = await withRetry(() =>
      this.client.keys(skipConfigPattern)
    );
    if (skipConfigKeys.length > 0) {
      await withRetry(() => this.client.del(...skipConfigKeys));
    }
  }

  // ---------- 搜索历史 ----------
  private shKey(user: string) {
    return `u:${user}:sh`; // u:username:sh
  }

  async getSearchHistory(userName: string): Promise<string[]> {
    const result = await withRetry(() =>
      this.client.lrange(this.shKey(userName), 0, -1)
    );
    // 确保返回的都是字符串类型
    return ensureStringArray(result as any[]);
  }

  async addSearchHistory(userName: string, keyword: string): Promise<void> {
    const key = this.shKey(userName);
    // 先去重
    await withRetry(() => this.client.lrem(key, 0, ensureString(keyword)));
    // 插入到最前
    await withRetry(() => this.client.lpush(key, ensureString(keyword)));
    // 限制最大长度
    await withRetry(() => this.client.ltrim(key, 0, SEARCH_HISTORY_LIMIT - 1));
  }

  async deleteSearchHistory(userName: string, keyword?: string): Promise<void> {
    const key = this.shKey(userName);
    if (keyword) {
      await withRetry(() => this.client.lrem(key, 0, ensureString(keyword)));
    } else {
      await withRetry(() => this.client.del(key));
    }
  }

  // ---------- 获取全部用户 ----------
  async getAllUsers(): Promise<string[]> {
    const keys = await withRetry(() => this.client.keys('u:*:pwd'));
    return keys
      .map((k) => {
        const match = k.match(/^u:(.+?):pwd$/);
        return match ? ensureString(match[1]) : undefined;
      })
      .filter((u): u is string => typeof u === 'string');
  }

  // ---------- 管理员配置 ----------
  private adminConfigKey() {
    return 'admin:config';
  }

  async getAdminConfig(): Promise<AdminConfig | null> {
    const val = await withRetry(() => this.client.get(this.adminConfigKey()));
    if (!val) return null;
    // 如果是字符串，解析它；否则直接返回（兼容旧数据）
    if (typeof val === 'string') {
      return JSON.parse(val) as AdminConfig;
    }
    return val as AdminConfig;
  }

  async setAdminConfig(config: AdminConfig): Promise<void> {
    // 使用 JSON.stringify 确保序列化一致性，避免字段丢失
    await withRetry(() => this.client.set(this.adminConfigKey(), JSON.stringify(config)));
  }

  // ---------- 跳过片头片尾配置 ----------
  private skipConfigKey(user: string, source: string, id: string) {
    return `u:${user}:skip:${source}+${id}`;
  }

  async getSkipConfig(
    userName: string,
    source: string,
    id: string
  ): Promise<SkipConfig | null> {
    const val = await withRetry(() =>
      this.client.get(this.skipConfigKey(userName, source, id))
    );
    return val ? (val as SkipConfig) : null;
  }

  async setSkipConfig(
    userName: string,
    source: string,
    id: string,
    config: SkipConfig
  ): Promise<void> {
    await withRetry(() =>
      this.client.set(this.skipConfigKey(userName, source, id), config)
    );
  }

  async deleteSkipConfig(
    userName: string,
    source: string,
    id: string
  ): Promise<void> {
    await withRetry(() =>
      this.client.del(this.skipConfigKey(userName, source, id))
    );
  }

  async getAllSkipConfigs(
    userName: string
  ): Promise<{ [key: string]: SkipConfig }> {
    const pattern = `u:${userName}:skip:*`;
    const keys = await withRetry(() => this.client.keys(pattern));

    if (keys.length === 0) {
      return {};
    }

    const configs: { [key: string]: SkipConfig } = {};

    // 批量获取所有配置
    const values = await withRetry(() => this.client.mget(keys));

    keys.forEach((key, index) => {
      const value = values[index];
      if (value) {
        // 从key中提取source+id
        const match = key.match(/^u:.+?:skip:(.+)$/);
        if (match) {
          const sourceAndId = match[1];
          configs[sourceAndId] = value as SkipConfig;
        }
      }
    });

    return configs;
  }

  // 清空所有数据
  async clearAllData(): Promise<void> {
    const client = getUpstashRedisClient();
    await client.flushall();
  }

  // ---------- 订阅和支付相关 (Implemented for Upstash Redis) ----------

  // === 1. 支付设置管理 ===

  async getPaymentSettings(): Promise<import('./types').PaymentSettings | null> {
    const client = getUpstashRedisClient();
    const data = await withRetry(() => client.hgetall('payment:settings'));

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      id: 1,
      alipay_qr_code: data.alipay_qr_code as string,
      alipay_account_name: data.alipay_account_name as string,
      payment_notice: data.payment_notice as string,
      auto_approval: String(data.auto_approval) === '1',
      order_expire_hours: data.order_expire_hours ? parseInt(data.order_expire_hours as string) : 24,
    };
  }

  async savePaymentSettings(settings: import('./types').PaymentSettings): Promise<void> {
    const client = getUpstashRedisClient();
    await withRetry(() => client.hset('payment:settings', {
      alipay_qr_code: settings.alipay_qr_code || '',
      alipay_account_name: settings.alipay_account_name || '',
      payment_notice: settings.payment_notice || '',
      auto_approval: settings.auto_approval ? '1' : '0',
      order_expire_hours: (settings.order_expire_hours || 24).toString(),
    }));
  }

  // === 2. 订阅套餐管理 ===

  async getSubscriptionPlans(includeInactive?: boolean): Promise<import('./types').SubscriptionPlan[]> {
    const client = getUpstashRedisClient();
    const setKey = includeInactive ? 'subscription:plans:all' : 'subscription:plans:active';

    // 获取所有套餐ID（按sort_order排序）
    const planIds = await withRetry(() => client.zrange(setKey, 0, -1)) as string[];

    if (!planIds || planIds.length === 0) {
      return [];
    }

    const plans: import('./types').SubscriptionPlan[] = [];

    for (const id of planIds) {
      const plan = await this.getPlanById(parseInt(id));
      if (plan) {
        plans.push(plan);
      }
    }

    return plans;
  }

  async getPlanById(id: number): Promise<import('./types').SubscriptionPlan | null> {
    const client = getUpstashRedisClient();
    const data = await withRetry(() => client.hgetall(`subscription:plan:${id}`));

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      id: parseInt(data.id as string),
      name: data.name as string,
      description: data.description as string,
      duration_days: parseInt(data.duration_days as string),
      price: parseFloat(data.price as string),
      original_price: data.original_price ? parseFloat(data.original_price as string) : undefined,
      features: data.features as string,
      is_active: String(data.is_active) === '1',
      sort_order: parseInt(data.sort_order as string),
    };
  }

  async saveSubscriptionPlan(plan: import('./types').SubscriptionPlan): Promise<void> {
    const client = getUpstashRedisClient();

    let planId: number = plan.id || 0;

    // 如果没有ID，生成新ID
    if (!planId) {
      planId = (await withRetry(() => client.incr('subscription:plan:counter'))) as number;
    }

    // 保存套餐数据
    await withRetry(() => client.hset(`subscription:plan:${planId}`, {
      id: planId.toString(),
      name: plan.name,
      description: plan.description || '',
      duration_days: plan.duration_days.toString(),
      price: plan.price.toString(),
      original_price: plan.original_price?.toString() || '',
      features: plan.features,
      is_active: plan.is_active ? '1' : '0',
      sort_order: plan.sort_order.toString(),
    }));

    // 添加到所有套餐列表（使用sort_order作为score）
    await withRetry(() => client.zadd('subscription:plans:all', {
      score: plan.sort_order,
      member: planId!.toString(),
    }));

    // 如果是活跃套餐，添加到活跃列表
    if (plan.is_active) {
      await withRetry(() => client.zadd('subscription:plans:active', {
        score: plan.sort_order,
        member: planId!.toString(),
      }));
    } else {
      // 如果是禁用，从活跃列表移除
      await withRetry(() => client.zrem('subscription:plans:active', planId!.toString()));
    }
  }

  // === 3. 用户订阅管理 ===

  async getUserSubscription(userName: string): Promise<import('./types').UserSubscription | null> {
    const client = getUpstashRedisClient();
    const data = await withRetry(() => client.hgetall(`user:subscription:${userName}`));

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    const subscription: import('./types').UserSubscription = {
      id: parseInt(data.id as string),
      user_id: data.user_id ? parseInt(data.user_id as string) : undefined,
      username: data.username as string,
      plan_id: parseInt(data.plan_id as string),
      status: data.status as 'active' | 'expired' | 'cancelled',
      start_date: data.start_date as string,
      end_date: data.end_date as string,
      end_date: data.end_date as string,
      auto_renew: String(data.auto_renew) === '1',
      plan_name: data.plan_name as string,
    };

    // 检查是否过期
    if (subscription.status === 'active' && new Date(subscription.end_date) < new Date()) {
      subscription.status = 'expired';
      await this.updateUserSubscription(subscription);
    }

    return subscription;
  }

  async createUserSubscription(subscription: import('./types').UserSubscription): Promise<void> {
    const client = getUpstashRedisClient();

    // 检查旧订阅，如果存在则取消
    const oldSub = await this.getUserSubscription(subscription.username!);
    if (oldSub && oldSub.status === 'active') {
      oldSub.status = 'cancelled';
      await this.updateUserSubscription(oldSub);
    }

    // 生成新ID
    const subId = await withRetry(() => client.incr('user:subscription:counter')) as number;

    // 获取套餐名称
    let planName = subscription.plan_name;
    if (!planName) {
      const plan = await this.getPlanById(subscription.plan_id);
      planName = plan?.name || '';
    }

    // 保存新订阅
    await withRetry(() => client.hset(`user:subscription:${subscription.username}`, {
      id: subId.toString(),
      user_id: subscription.user_id?.toString() || '',
      username: subscription.username || '',
      plan_id: subscription.plan_id.toString(),
      plan_name: planName,
      status: 'active',
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      auto_renew: subscription.auto_renew ? '1' : '0',
    }));

    // 添加到历史记录
    await withRetry(() => client.lpush(
      `user:subscriptions:history:${subscription.username}`,
      JSON.stringify({
        ...subscription,
        id: subId,
        plan_name: planName,
      })
    ));
  }

  async updateUserSubscription(subscription: import('./types').UserSubscription): Promise<void> {
    const client = getUpstashRedisClient();

    await withRetry(() => client.hset(`user:subscription:${subscription.username}`, {
      id: subscription.id?.toString() || '',
      user_id: subscription.user_id?.toString() || '',
      username: subscription.username || '',
      plan_id: subscription.plan_id.toString(),
      plan_name: subscription.plan_name || '',
      status: subscription.status,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      auto_renew: subscription.auto_renew ? '1' : '0',
    }));
  }

  // === 4. 订单管理 ===

  async createOrder(order: import('./types').PaymentOrder): Promise<string> {
    const client = getUpstashRedisClient();

    // 生成订单号
    const orderNo = order.order_no || `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const createdAt = new Date().toISOString();

    // 计算过期时间
    const settings = await this.getPaymentSettings();
    const expireHours = settings?.order_expire_hours || 24;
    const expiresAt = new Date(Date.now() + expireHours * 60 * 60 * 1000).toISOString();

    // 保存订单
    await withRetry(() => client.hset(`payment:order:${orderNo}`, {
      order_no: orderNo,
      user_id: order.user_id?.toString() || '',
      username: order.username || '',
      order_type: order.order_type,
      related_id: order.related_id?.toString() || '',
      amount: order.amount.toString(),
      payment_method: order.payment_method,
      payment_status: 'pending',
      payment_proof: order.payment_proof || '',
      verified_by: order.verified_by?.toString() || '',
      verified_at: order.verified_at || '',
      reject_reason: order.reject_reason || '',
      paid_at: order.paid_at || '',
      expires_at: expiresAt,
      created_at: createdAt,
    }));

    // 添加到各个索引（使用时间戳作为score）
    const timestamp = Date.now();
    await withRetry(() => client.zadd('payment:orders:all', {
      score: timestamp,
      member: orderNo,
    }));

    await withRetry(() => client.zadd(`payment:orders:user:${order.username}`, {
      score: timestamp,
      member: orderNo,
    }));

    await withRetry(() => client.zadd('payment:orders:pending', {
      score: timestamp,
      member: orderNo,
    }));

    return orderNo;
  }

  async getOrder(orderNo: string): Promise<import('./types').PaymentOrder | null> {
    const client = getUpstashRedisClient();
    const data = await withRetry(() => client.hgetall(`payment:order:${orderNo}`));

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      id: undefined,
      order_no: data.order_no as string,
      user_id: data.user_id ? parseInt(data.user_id as string) : undefined,
      username: data.username as string,
      order_type: data.order_type as 'subscription' | 'credits',
      related_id: data.related_id ? parseInt(data.related_id as string) : undefined,
      amount: parseFloat(data.amount as string),
      payment_method: data.payment_method as string,
      payment_status: data.payment_status as 'pending' | 'approved' | 'rejected' | 'expired',
      payment_proof: data.payment_proof as string,
      verified_by: data.verified_by ? parseInt(data.verified_by as string) : undefined,
      verified_at: data.verified_at as string,
      reject_reason: data.reject_reason as string,
      paid_at: data.paid_at as string,
      expires_at: data.expires_at as string,
      created_at: data.created_at as string,
    };
  }

  async getOrdersByUser(userName: string): Promise<import('./types').PaymentOrder[]> {
    const client = getUpstashRedisClient();

    // 获取订单号列表（倒序，最新的在前）
    const orderNos = await withRetry(() =>
      client.zrange(`payment:orders:user:${userName}`, 0, -1, { rev: true })
    ) as string[];

    if (!orderNos || orderNos.length === 0) {
      return [];
    }

    const orders: import('./types').PaymentOrder[] = [];

    for (const orderNo of orderNos) {
      const order = await this.getOrder(orderNo);
      if (order) {
        orders.push(order);
      }
    }

    return orders;
  }

  async getPendingOrders(): Promise<import('./types').PaymentOrder[]> {
    const client = getUpstashRedisClient();

    const orderNos = await withRetry(() =>
      client.zrange('payment:orders:pending', 0, -1, { rev: true })
    ) as string[];

    if (!orderNos || orderNos.length === 0) {
      return [];
    }

    const orders: import('./types').PaymentOrder[] = [];

    for (const orderNo of orderNos) {
      const order = await this.getOrder(orderNo);
      if (order) {
        orders.push(order);
      }
    }

    return orders;
  }

  async getAllOrders(page: number = 1, limit: number = 20): Promise<{ orders: import('./types').PaymentOrder[], total: number }> {
    const client = getUpstashRedisClient();

    // 获取总数
    const total = await withRetry(() => client.zcard('payment:orders:all')) as number;

    // 计算分页
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // 获取订单号（倒序）
    const orderNos = await withRetry(() =>
      client.zrange('payment:orders:all', start, end, { rev: true })
    ) as string[];

    const orders: import('./types').PaymentOrder[] = [];

    for (const orderNo of orderNos) {
      const order = await this.getOrder(orderNo);
      if (order) {
        orders.push(order);
      }
    }

    return { orders, total: total || 0 };
  }

  async updateOrderProof(orderNo: string, proofPath: string): Promise<void> {
    const client = getUpstashRedisClient();
    await withRetry(() => client.hset(`payment:order:${orderNo}`, {
      payment_proof: proofPath,
    }));
  }

  async updateOrderStatus(orderNo: string, status: 'approved' | 'rejected', adminId?: number, reason?: string): Promise<void> {
    const client = getUpstashRedisClient();
    const order = await this.getOrder(orderNo);

    if (!order) {
      throw new Error('Order not found');
    }

    const verifiedAt = new Date().toISOString();

    // 更新订单状态
    await withRetry(() => client.hset(`payment:order:${orderNo}`, {
      payment_status: status,
      verified_by: adminId?.toString() || '',
      verified_at: verifiedAt,
      reject_reason: reason || '',
    }));

    // 从待审核列表移除
    await withRetry(() => client.zrem('payment:orders:pending', orderNo));

    // 如果订单通过且是订阅类型，自动激活会员
    if (status === 'approved' && order.order_type === 'subscription' && order.related_id) {
      const plan = await this.getPlanById(order.related_id);

      if (plan) {
        const startDate = new Date().toISOString();
        const endDate = new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString();

        await this.createUserSubscription({
          username: order.username,
          user_id: order.user_id,
          plan_id: plan.id!,
          plan_name: plan.name,
          status: 'active',
          start_date: startDate,
          end_date: endDate,
          auto_renew: false,
        });
      }
    }
  }
}

// 单例 Upstash Redis 客户端
function getUpstashRedisClient(): Redis {
  const globalKey = Symbol.for('__MOONTV_UPSTASH_REDIS_CLIENT__');
  let client: Redis | undefined = (global as any)[globalKey];

  if (!client) {
    const upstashUrl = process.env.UPSTASH_URL;
    const upstashToken = process.env.UPSTASH_TOKEN;

    if (!upstashUrl || !upstashToken) {
      throw new Error(
        'UPSTASH_URL and UPSTASH_TOKEN env variables must be set'
      );
    }

    // 创建 Upstash Redis 客户端
    client = new Redis({
      url: upstashUrl,
      token: upstashToken,
      // 可选配置
      retry: {
        retries: 3,
        backoff: (retryCount: number) =>
          Math.min(1000 * Math.pow(2, retryCount), 30000),
      },
    });

    console.log('Upstash Redis client created successfully');

    (global as any)[globalKey] = client;
  }

  return client;
}
