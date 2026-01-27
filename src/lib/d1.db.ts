/* eslint-disable no-console, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import { AdminConfig } from './admin.types';
import { Favorite, IStorage, PlayRecord, SkipConfig, SubscriptionPlan, UserSubscription, PaymentOrder, PaymentSettings } from './types';

// 搜索历史最大条数
const SEARCH_HISTORY_LIMIT = 20;

// D1 数据库类型定义
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1Result>;
}

interface D1PreparedStatement {
  bind(...params: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  all<T = any>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Result<T = any> {
  success: boolean;
  results?: T[];
  meta?: any;
}

// 获取 D1 数据库绑定
function getD1Database(): D1Database {
  // 在 Cloudflare Pages 环境中，D1 数据库通过环境变量绑定
  if (typeof process !== 'undefined' && process.env) {
    return (process.env as any).DB as D1Database;
  }

  // 在浏览器环境中，D1 不可用
  throw new Error(
    'D1 database is only available in Cloudflare Pages environment'
  );
}

export class D1Storage implements IStorage {
  private db: D1Database;

  constructor() {
    this.db = getD1Database();
  }

  // ---------- 用户相关 ----------
  private async getUserId(username: string): Promise<number | null> {
    const result = await this.db
      .prepare('SELECT id FROM users WHERE username = ?')
      .bind(username)
      .first();

    return result ? (result.id as number) : null;
  }

  // 如果用户不存在则自动创建（角色默认为 user）
  private async ensureUser(username: string): Promise<number> {
    let userId = await this.getUserId(username);
    if (userId) return userId;

    await this.db
      .prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .bind(username, '', 'user')
      .run();

    userId = await this.getUserId(username);
    if (!userId) throw new Error('Failed to create user');
    return userId;
  }

  async registerUser(userName: string, password: string): Promise<void> {
    await this.db
      .prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .bind(userName, password)
      .run();
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    const result = await this.db
      .prepare('SELECT id FROM users WHERE username = ? AND password = ?')
      .bind(userName, password)
      .first();

    return !!result;
  }

  async checkUserExist(userName: string): Promise<boolean> {
    const result = await this.db
      .prepare('SELECT id FROM users WHERE username = ?')
      .bind(userName)
      .first();

    return !!result;
  }

  async changePassword(userName: string, newPassword: string): Promise<void> {
    const userId = await this.getUserId(userName);
    if (!userId) throw new Error('User not found');

    await this.db
      .prepare('UPDATE users SET password = ? WHERE id = ?')
      .bind(newPassword, userId)
      .run();
  }

  async deleteUser(userName: string): Promise<void> {
    const userId = await this.getUserId(userName);
    if (!userId) return;

    // 删除用户的所有数据
    await this.db
      .prepare('DELETE FROM play_records WHERE user_id = ?')
      .bind(userId)
      .run();

    await this.db
      .prepare('DELETE FROM favorites WHERE user_id = ?')
      .bind(userId)
      .run();

    await this.db
      .prepare('DELETE FROM search_history WHERE user_id = ?')
      .bind(userId)
      .run();

    await this.db
      .prepare('DELETE FROM skip_configs WHERE user_id = ?')
      .bind(userId)
      .run();

    await this.db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
  }

  // ---------- 播放记录 ----------
  async getPlayRecord(
    userName: string,
    key: string
  ): Promise<PlayRecord | null> {
    const [source, videoId] = key.split('+');
    if (!source || !videoId) {
      return null;
    }
    const userId = await this.getUserId(userName);
    if (!userId) return null;

    const result = await this.db
      .prepare(
        `
        SELECT * FROM play_records 
        WHERE user_id = ? AND source = ? AND video_id = ?
      `
      )
      .bind(userId, source, videoId)
      .first();

    if (!result) return null;

    return {
      title: result.title as string,
      source_name: result.source_name as string,
      year: result.year as string,
      cover: result.cover as string,
      index: result.episode_index as number,
      total_episodes: result.total_episodes as number,
      play_time: result.play_time as number,
      total_time: result.total_time as number,
      save_time: result.save_time as number,
      search_title: result.search_title as string,
    };
  }

  async setPlayRecord(
    userName: string,
    key: string,
    record: PlayRecord
  ): Promise<void> {
    const [source, videoId] = key.split('+');
    if (!source || !videoId) {
      throw new Error('Invalid key format for play record');
    }
    const userId = await this.ensureUser(userName);

    // 删除同名的旧记录
    if (record.title) {
      await this.db
        .prepare(
          `
          DELETE FROM play_records 
          WHERE user_id = ? AND title = ? AND NOT (source = ? AND video_id = ?)
        `
        )
        .bind(userId, record.title, source, videoId)
        .run();
    }

    await this.db
      .prepare(
        `
        INSERT INTO play_records 
        (user_id, source, video_id, title, source_name, year, cover, episode_index, 
         total_episodes, play_time, total_time, save_time, search_title)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, source, video_id) 
        DO UPDATE SET
          title = excluded.title,
          source_name = excluded.source_name,
          year = excluded.year,
          cover = excluded.cover,
          episode_index = excluded.episode_index,
          total_episodes = excluded.total_episodes,
          play_time = excluded.play_time,
          total_time = excluded.total_time,
          save_time = excluded.save_time,
          search_title = excluded.search_title,
          updated_at = CURRENT_TIMESTAMP
      `
      )
      .bind(
        userId,
        source,
        videoId,
        record.title || '',
        record.source_name || '',
        record.year || '',
        record.cover || '',
        record.index ?? 0,
        record.total_episodes ?? 0,
        record.play_time ?? 0,
        record.total_time ?? 0,
        record.save_time ?? Date.now(),
        record.search_title || ''
      )
      .run();
  }

  async getAllPlayRecords(
    userName: string
  ): Promise<Record<string, PlayRecord>> {
    const userId = await this.getUserId(userName);
    if (!userId) return {};

    const results = await this.db
      .prepare('SELECT * FROM play_records WHERE user_id = ?')
      .bind(userId)
      .all();

    const records: Record<string, PlayRecord> = {};
    for (const result of results.results || []) {
      const key = `${result.source}+${result.video_id}`;
      records[key] = {
        title: result.title as string,
        source_name: result.source_name as string,
        year: result.year as string,
        cover: result.cover as string,
        index: result.episode_index as number,
        total_episodes: result.total_episodes as number,
        play_time: result.play_time as number,
        total_time: result.total_time as number,
        save_time: result.save_time as number,
        search_title: result.search_title as string,
      };
    }

    return records;
  }

  async deletePlayRecord(userName: string, key: string): Promise<void> {
    const [source, videoId] = key.split('+');
    if (!source || !videoId) {
      return;
    }
    const userId = await this.getUserId(userName);
    if (!userId) return;

    await this.db
      .prepare(
        'DELETE FROM play_records WHERE user_id = ? AND source = ? AND video_id = ?'
      )
      .bind(userId, source, videoId)
      .run();
  }

  // ---------- 收藏 ----------
  async getFavorite(userName: string, key: string): Promise<Favorite | null> {
    const [source, videoId] = key.split('+');
    if (!source || !videoId) {
      return null;
    }
    const userId = await this.getUserId(userName);
    if (!userId) return null;

    const result = await this.db
      .prepare(
        'SELECT * FROM favorites WHERE user_id = ? AND source = ? AND video_id = ?'
      )
      .bind(userId, source, videoId)
      .first();

    if (!result) return null;

    return {
      title: result.title as string,
      source_name: result.source_name as string,
      year: result.year as string,
      cover: result.cover as string,
      total_episodes: result.total_episodes as number,
      save_time: result.save_time as number,
      search_title: result.search_title as string,
    };
  }

  async setFavorite(
    userName: string,
    key: string,
    favorite: Favorite
  ): Promise<void> {
    const [source, videoId] = key.split('+');
    if (!source || !videoId) {
      throw new Error('Invalid key format for favorite');
    }
    const userId = await this.ensureUser(userName);

    await this.db
      .prepare(
        `
        INSERT INTO favorites 
        (user_id, source, video_id, title, source_name, year, cover, total_episodes, save_time, search_title)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, source, video_id) 
        DO UPDATE SET
          title = excluded.title,
          source_name = excluded.source_name,
          year = excluded.year,
          cover = excluded.cover,
          total_episodes = excluded.total_episodes,
          save_time = excluded.save_time,
          search_title = excluded.search_title
      `
      )
      .bind(
        userId,
        source,
        videoId,
        favorite.title || '',
        favorite.source_name || '',
        favorite.year || '',
        favorite.cover || '',
        favorite.total_episodes ?? 0,
        favorite.save_time ?? Date.now(),
        favorite.search_title || ''
      )
      .run();
  }

  async getAllFavorites(userName: string): Promise<Record<string, Favorite>> {
    const userId = await this.getUserId(userName);
    if (!userId) return {};

    const results = await this.db
      .prepare('SELECT * FROM favorites WHERE user_id = ?')
      .bind(userId)
      .all();

    const favorites: Record<string, Favorite> = {};
    for (const result of results.results || []) {
      const key = `${result.source}+${result.video_id}`;
      favorites[key] = {
        title: result.title as string,
        source_name: result.source_name as string,
        year: result.year as string,
        cover: result.cover as string,
        total_episodes: result.total_episodes as number,
        save_time: result.save_time as number,
        search_title: result.search_title as string,
      };
    }

    return favorites;
  }

  async deleteFavorite(userName: string, key: string): Promise<void> {
    const [source, videoId] = key.split('+');
    if (!source || !videoId) {
      return;
    }
    const userId = await this.getUserId(userName);
    if (!userId) return;

    await this.db
      .prepare(
        'DELETE FROM favorites WHERE user_id = ? AND source = ? AND video_id = ?'
      )
      .bind(userId, source, videoId)
      .run();
  }

  // ---------- 搜索历史 ----------
  async getSearchHistory(userName: string): Promise<string[]> {
    const userId = await this.getUserId(userName);
    if (!userId) return [];

    const results = await this.db
      .prepare(
        `
        SELECT keyword FROM search_history 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `
      )
      .bind(userId, SEARCH_HISTORY_LIMIT)
      .all();

    return (results.results || []).map(
      (result: any) => result.keyword as string
    );
  }

  async addSearchHistory(userName: string, keyword: string): Promise<void> {
    const userId = await this.ensureUser(userName);

    // 先删除已存在的相同关键词
    await this.db
      .prepare('DELETE FROM search_history WHERE user_id = ? AND keyword = ?')
      .bind(userId, keyword)
      .run();

    // 插入新关键词
    await this.db
      .prepare('INSERT INTO search_history (user_id, keyword) VALUES (?, ?)')
      .bind(userId, keyword)
      .run();

    // 保持搜索历史不超过限制
    await this.db
      .prepare(
        `
        DELETE FROM search_history 
        WHERE user_id = ? AND id NOT IN (
          SELECT id FROM search_history 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT ?
        )
      `
      )
      .bind(userId, userId, SEARCH_HISTORY_LIMIT)
      .run();
  }

  async deleteSearchHistory(userName: string, keyword?: string): Promise<void> {
    const userId = await this.getUserId(userName);
    if (!userId) return;

    if (keyword) {
      await this.db
        .prepare('DELETE FROM search_history WHERE user_id = ? AND keyword = ?')
        .bind(userId, keyword)
        .run();
    } else {
      await this.db
        .prepare('DELETE FROM search_history WHERE user_id = ?')
        .bind(userId)
        .run();
    }
  }

  // ---------- 获取全部用户 ----------
  async getAllUsers(): Promise<string[]> {
    const results = await this.db.prepare('SELECT username FROM users').all();

    return (results.results || []).map(
      (result: any) => result.username as string
    );
  }

  // ---------- 管理员配置 ----------
  async getAdminConfig(): Promise<AdminConfig | null> {
    try {
      const result = await this.db
        .prepare('SELECT config FROM admin_config WHERE id = 1')
        .first<{ config: string }>();

      if (!result) return null;

      return JSON.parse(result.config) as AdminConfig;
    } catch (err) {
      console.error('Failed to get admin config:', err);
      throw err;
    }
  }

  async setAdminConfig(config: AdminConfig): Promise<void> {
    try {
      await this.db
        .prepare(
          'INSERT OR REPLACE INTO admin_config (id, config) VALUES (1, ?)'
        )
        .bind(JSON.stringify(config))
        .run();
    } catch (err) {
      console.error('Failed to set admin config:', err);
      throw err;
    }
  }

  // ---------- 跳过片头片尾配置 ----------
  async getSkipConfig(
    userName: string,
    source: string,
    id: string
  ): Promise<SkipConfig | null> {
    const userId = await this.getUserId(userName);
    if (!userId) return null;

    const result = await this.db
      .prepare(
        'SELECT * FROM skip_configs WHERE user_id = ? AND source = ? AND video_id = ?'
      )
      .bind(userId, source, id)
      .first();

    if (!result) return null;

    return {
      enable: Boolean(result.enable),
      intro_time: result.intro_time as number,
      outro_time: result.outro_time as number,
    };
  }

  async setSkipConfig(
    userName: string,
    source: string,
    id: string,
    config: SkipConfig
  ): Promise<void> {
    const userId = await this.ensureUser(userName);

    await this.db
      .prepare(
        `
        INSERT INTO skip_configs (user_id, source, video_id, enable, intro_time, outro_time)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, source, video_id)
        DO UPDATE SET
          enable = excluded.enable,
          intro_time = excluded.intro_time,
          outro_time = excluded.outro_time,
          updated_at = CURRENT_TIMESTAMP
      `
      )
      .bind(
        userId,
        source,
        id,
        config.enable ? 1 : 0,
        config.intro_time ?? 0,
        config.outro_time ?? 0
      )
      .run();
  }

  async deleteSkipConfig(
    userName: string,
    source: string,
    id: string
  ): Promise<void> {
    const userId = await this.getUserId(userName);
    if (!userId) return;

    await this.db
      .prepare(
        'DELETE FROM skip_configs WHERE user_id = ? AND source = ? AND video_id = ?'
      )
      .bind(userId, source, id)
      .run();
  }

  async getAllSkipConfigs(
    userName: string
  ): Promise<{ [key: string]: SkipConfig }> {
    const userId = await this.getUserId(userName);
    if (!userId) return {};

    const results = await this.db
      .prepare('SELECT * FROM skip_configs WHERE user_id = ?')
      .bind(userId)
      .all();

    const configs: { [key: string]: SkipConfig } = {};
    for (const result of results.results || []) {
      const key = `${result.source}+${result.video_id}`;
      configs[key] = {
        enable: Boolean(result.enable),
        intro_time: result.intro_time as number,
        outro_time: result.outro_time as number,
      };
    }

    return configs;
  }

  // 清空所有数据
  async clearAllData(): Promise<void> {
    // 删除所有表的数据
    await this.db.prepare('DELETE FROM play_records').run();
    await this.db.prepare('DELETE FROM favorites').run();
    await this.db.prepare('DELETE FROM search_history').run();
    await this.db.prepare('DELETE FROM skip_configs').run();
    await this.db.prepare('DELETE FROM users').run();
    await this.db.prepare('DELETE FROM admin_config').run();
    // 清空支付相关表
    await this.db.prepare('DELETE FROM payment_orders').run();
    await this.db.prepare('DELETE FROM user_subscriptions').run();
    await this.db.prepare('DELETE FROM subscription_plans').run();
    await this.db.prepare('DELETE FROM payment_settings').run();
  }

  // ---------- 订阅和支付相关实现 ----------

  // 1. 订阅套餐
  async getSubscriptionPlans(includeInactive?: boolean): Promise<SubscriptionPlan[]> {
    let sql = 'SELECT * FROM subscription_plans';
    if (!includeInactive) {
      sql += ' WHERE is_active = 1';
    }
    sql += ' ORDER BY sort_order ASC';

    const result = await this.db.prepare(sql).all<SubscriptionPlan>();
    return result.results || [];
  }

  async getPlanById(id: number): Promise<SubscriptionPlan | null> {
    const result = await this.db.prepare(
      'SELECT * FROM subscription_plans WHERE id = ?'
    ).bind(id).first<SubscriptionPlan>();
    return result;
  }

  async saveSubscriptionPlan(plan: SubscriptionPlan): Promise<void> {
    if (plan.id) {
      // Update
      await this.db.prepare(
        `UPDATE subscription_plans SET 
         name = ?, description = ?, duration_days = ?, price = ?, 
         original_price = ?, features = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(
        plan.name, plan.description, plan.duration_days, plan.price,
        plan.original_price, plan.features, plan.is_active ? 1 : 0, plan.sort_order, plan.id
      ).run();
    } else {
      // Insert
      await this.db.prepare(
        `INSERT INTO subscription_plans 
         (name, description, duration_days, price, original_price, features, is_active, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        plan.name, plan.description, plan.duration_days, plan.price,
        plan.original_price, plan.features, plan.is_active ? 1 : 0, plan.sort_order
      ).run();
    }
  }

  // 2. 用户订阅
  async getUserSubscription(userName: string): Promise<UserSubscription | null> {
    const userId = await this.getUserId(userName);
    if (!userId) return null;

    const result = await this.db.prepare(
      `SELECT us.*, sp.name as plan_name 
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = ? AND us.status = 'active' AND us.end_date > CURRENT_TIMESTAMP
       ORDER BY us.end_date DESC LIMIT 1`
    ).bind(userId).first<UserSubscription>();

    return result;
  }

  async createUserSubscription(subscription: UserSubscription): Promise<void> {
    // 这里的 username 是可选的，如果传入了 username，先获取 userId
    let userId = subscription.user_id;
    if (!userId && subscription.username) {
      userId = await this.getUserId(subscription.username) ?? undefined;
    }
    if (!userId) throw new Error('User not found');

    // 禁用旧的活跃订阅
    await this.db.prepare(
      "UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'"
    ).bind(userId).run();

    await this.db.prepare(
      `INSERT INTO user_subscriptions 
       (user_id, plan_id, status, start_date, end_date, auto_renew)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      userId, subscription.plan_id, 'active',
      subscription.start_date, subscription.end_date, subscription.auto_renew ? 1 : 0
    ).run();
  }

  async updateUserSubscription(subscription: UserSubscription): Promise<void> {
    if (!subscription.id) return;
    await this.db.prepare(
      "UPDATE user_subscriptions SET status = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(subscription.status, subscription.end_date, subscription.id).run();
  }

  // 3. 订单管理
  async createOrder(order: PaymentOrder): Promise<string> {
    let userId = order.user_id;
    if (!userId && order.username) {
      userId = await this.getUserId(order.username) ?? undefined;
    }
    if (!userId) throw new Error('User not found');

    // 生成订单号: ORD + 时间戳 + 随机数
    const orderNo = order.order_no || `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    await this.db.prepare(
      `INSERT INTO payment_orders 
       (order_no, user_id, order_type, related_id, amount, payment_method, payment_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`
    ).bind(
      orderNo, userId, order.order_type, order.related_id, order.amount, order.payment_method
    ).run();

    return orderNo;
  }

  async getOrder(orderNo: string): Promise<PaymentOrder | null> {
    const result = await this.db.prepare(
      `SELECT po.*, u.username 
       FROM payment_orders po
       LEFT JOIN users u ON po.user_id = u.id
       WHERE po.order_no = ?`
    ).bind(orderNo).first<PaymentOrder>();
    return result;
  }

  async getOrdersByUser(userName: string): Promise<PaymentOrder[]> {
    const userId = await this.getUserId(userName);
    if (!userId) return [];

    const result = await this.db.prepare(
      `SELECT po.*, sp.name as plan_name, sp.duration_days as plan_duration
       FROM payment_orders po
       LEFT JOIN subscription_plans sp ON po.related_id = sp.id AND po.order_type = 'subscription'
       WHERE po.user_id = ? 
       ORDER BY po.created_at DESC`
    ).bind(userId).all<PaymentOrder>();
    return result.results || [];
  }

  async getPendingOrders(): Promise<PaymentOrder[]> {
    const result = await this.db.prepare(
      `SELECT po.*, u.username, sp.name as plan_name, sp.duration_days as plan_duration
       FROM payment_orders po
       LEFT JOIN users u ON po.user_id = u.id
       LEFT JOIN subscription_plans sp ON po.related_id = sp.id AND po.order_type = 'subscription'
       WHERE po.payment_status = 'pending' 
       ORDER BY po.created_at DESC`
    ).all<PaymentOrder>();
    return result.results || [];
  }

  async getAllOrders(page: number = 1, limit: number = 20): Promise<{ orders: PaymentOrder[], total: number }> {
    const offset = (page - 1) * limit;

    const countResult = await this.db.prepare(
      'SELECT count(*) as count FROM payment_orders'
    ).first<{ count: number }>();

    const result = await this.db.prepare(
      `SELECT po.*, u.username, sp.name as plan_name, sp.duration_days as plan_duration
       FROM payment_orders po
       LEFT JOIN users u ON po.user_id = u.id
       LEFT JOIN subscription_plans sp ON po.related_id = sp.id AND po.order_type = 'subscription'
       ORDER BY po.created_at DESC 
       LIMIT ? OFFSET ?`
    ).bind(limit, offset).all<PaymentOrder>();

    return {
      orders: result.results || [],
      total: countResult?.count || 0
    };
  }

  async updateOrderProof(orderNo: string, proofPath: string): Promise<void> {
    await this.db.prepare(
      "UPDATE payment_orders SET payment_proof = ?, paid_at = CURRENT_TIMESTAMP WHERE order_no = ?"
    ).bind(proofPath, orderNo).run();
  }

  async updateOrderStatus(orderNo: string, status: 'approved' | 'rejected', adminId?: number, reason?: string): Promise<void> {
    if (status === 'approved') {
      await this.db.prepare(
        "UPDATE payment_orders SET payment_status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE order_no = ?"
      ).bind(status, adminId, orderNo).run();
    } else {
      await this.db.prepare(
        "UPDATE payment_orders SET payment_status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP, reject_reason = ? WHERE order_no = ?"
      ).bind(status, adminId, reason, orderNo).run();
    }
  }

  // 4. 支付设置
  async getPaymentSettings(): Promise<PaymentSettings | null> {
    const result = await this.db.prepare(
      'SELECT * FROM payment_settings WHERE id = 1'
    ).first<PaymentSettings>();
    return result;
  }

  async savePaymentSettings(settings: PaymentSettings): Promise<void> {
    await this.db.prepare(
      `INSERT INTO payment_settings (id, alipay_qr_code, alipay_account_name, payment_notice, auto_approval, order_expire_hours)
       VALUES (1, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
       alipay_qr_code = excluded.alipay_qr_code,
       alipay_account_name = excluded.alipay_account_name,
       payment_notice = excluded.payment_notice,
       auto_approval = excluded.auto_approval,
       order_expire_hours = excluded.order_expire_hours,
       updated_at = CURRENT_TIMESTAMP`
    ).bind(
      settings.alipay_qr_code, settings.alipay_account_name, settings.payment_notice,
      settings.auto_approval ? 1 : 0, settings.order_expire_hours
    ).run();
  }
}
