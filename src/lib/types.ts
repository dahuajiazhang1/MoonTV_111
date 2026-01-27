import { AdminConfig } from './admin.types';

// 播放记录数据结构
export interface PlayRecord {
  title: string;
  source_name: string;
  cover: string;
  year: string;
  index: number; // 第几集
  total_episodes: number; // 总集数
  play_time: number; // 播放进度（秒）
  total_time: number; // 总进度（秒）
  save_time: number; // 记录保存时间（时间戳）
  search_title: string; // 搜索时使用的标题
}

// 收藏数据结构
export interface Favorite {
  source_name: string;
  total_episodes: number; // 总集数
  title: string;
  year: string;
  cover: string;
  save_time: number; // 记录保存时间（时间戳）
  search_title: string; // 搜索时使用的标题
}



// ---------- 订阅和支付相关 ----------

export interface SubscriptionPlan {
  id?: number;
  name: string;
  description?: string;
  duration_days: number;
  price: number;
  original_price?: number;
  features: string; // JSON string
  is_active: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id?: number;
  user_id?: number;
  username?: string; // 方便前端显示
  plan_id: number;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  auto_renew: boolean;
  plan_name?: string; // 关联的套餐名称
}

export interface PaymentOrder {
  id?: number;
  order_no: string;
  user_id?: number;
  username?: string;
  order_type: 'subscription' | 'credits';
  related_id?: number;
  amount: number;
  payment_method: string;
  payment_status: 'pending' | 'approved' | 'rejected' | 'expired';
  payment_proof?: string;
  verified_by?: number;
  verified_at?: string;
  reject_reason?: string;
  paid_at?: string;
  expires_at?: string;
  created_at?: string;
  plan_name?: string;
  plan_duration?: number;
}

export interface PaymentSettings {
  id?: number;
  alipay_qr_code?: string;
  alipay_account_name?: string;
  payment_notice?: string;
  auto_approval?: boolean;
  order_expire_hours?: number;
}

// 扩展存储接口
export interface IStorage {
  // ... 原有接口保持不变 ...

  // 播放记录相关
  getPlayRecord(userName: string, key: string): Promise<PlayRecord | null>;
  setPlayRecord(
    userName: string,
    key: string,
    record: PlayRecord
  ): Promise<void>;
  getAllPlayRecords(userName: string): Promise<{ [key: string]: PlayRecord }>;
  deletePlayRecord(userName: string, key: string): Promise<void>;

  // 收藏相关
  getFavorite(userName: string, key: string): Promise<Favorite | null>;
  setFavorite(userName: string, key: string, favorite: Favorite): Promise<void>;
  getAllFavorites(userName: string): Promise<{ [key: string]: Favorite }>;
  deleteFavorite(userName: string, key: string): Promise<void>;

  // 用户相关
  registerUser(userName: string, password: string): Promise<void>;
  verifyUser(userName: string, password: string): Promise<boolean>;
  checkUserExist(userName: string): Promise<boolean>;
  changePassword(userName: string, newPassword: string): Promise<void>;
  deleteUser(userName: string): Promise<void>;

  // 搜索历史相关
  getSearchHistory(userName: string): Promise<string[]>;
  addSearchHistory(userName: string, keyword: string): Promise<void>;
  deleteSearchHistory(userName: string, keyword?: string): Promise<void>;

  // 用户列表
  getAllUsers(): Promise<string[]>;

  // 管理员配置相关
  getAdminConfig(): Promise<AdminConfig | null>;
  setAdminConfig(config: AdminConfig): Promise<void>;

  // 跳过片头片尾配置相关
  getSkipConfig(
    userName: string,
    source: string,
    id: string
  ): Promise<SkipConfig | null>;
  setSkipConfig(
    userName: string,
    source: string,
    id: string,
    config: SkipConfig
  ): Promise<void>;
  deleteSkipConfig(userName: string, source: string, id: string): Promise<void>;
  getAllSkipConfigs(userName: string): Promise<{ [key: string]: SkipConfig }>;

  // 数据清理
  clearAllData(): Promise<void>;

  // ---------- 新增：订阅和支付相关接口 ----------

  // 订阅套餐
  getSubscriptionPlans(includeInactive?: boolean): Promise<SubscriptionPlan[]>;
  getPlanById(id: number): Promise<SubscriptionPlan | null>;
  saveSubscriptionPlan(plan: SubscriptionPlan): Promise<void>;

  // 用户订阅
  getUserSubscription(userName: string): Promise<UserSubscription | null>;
  createUserSubscription(subscription: UserSubscription): Promise<void>;
  updateUserSubscription(subscription: UserSubscription): Promise<void>;

  // 订单管理
  createOrder(order: PaymentOrder): Promise<string>; // 返回 order_no
  getOrder(orderNo: string): Promise<PaymentOrder | null>;
  getOrdersByUser(userName: string): Promise<PaymentOrder[]>;
  getPendingOrders(): Promise<PaymentOrder[]>;
  getAllOrders(page?: number, limit?: number): Promise<{ orders: PaymentOrder[], total: number }>;
  updateOrderProof(orderNo: string, proofPath: string): Promise<void>;
  updateOrderStatus(orderNo: string, status: 'approved' | 'rejected', adminId?: number, reason?: string): Promise<void>;

  // 支付设置
  getPaymentSettings(): Promise<PaymentSettings | null>;
  savePaymentSettings(settings: PaymentSettings): Promise<void>;
}

// 搜索结果数据结构
export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  episodes: string[];
  episodes_titles: string[];
  source: string;
  source_name: string;
  class?: string;
  year: string;
  desc?: string;
  type_name?: string;
  douban_id?: number;
}

// 豆瓣数据结构
export interface DoubanItem {
  id: string;
  title: string;
  poster: string;
  rate: string;
  year: string;
}

export interface DoubanResult {
  code: number;
  message: string;
  list: DoubanItem[];
}

// 跳过片头片尾配置数据结构
export interface SkipConfig {
  enable: boolean; // 是否启用跳过片头片尾
  intro_time: number; // 片头时间（秒）
  outro_time: number; // 片尾时间（秒）
}

// 弹幕数据结构
export interface DanmakuItem {
  time: number; // 弹幕出现时间（秒）
  type: number; // 弹幕类型：1-滚动，2-顶部，3-底部
  color: number; // 弹幕颜色（十进制）
  text: string; // 弹幕文本
  size?: number; // 字体大小（可选）
  pool?: number; // 弹幕池（可选）
}

// 弹幕 API 响应数据结构（实际格式）
export interface DanmakuComment {
  cid: number;
  p: string; // 属性字符串，格式: "时间,类型,颜色,作者"
  m: string; // 弹幕文本内容
  t: number; // 时间（秒）
}

export interface DanmakuResponse {
  count?: number;
  comments?: DanmakuComment[]; // 实际的弹幕数组
  // 兼容其他格式
  code?: number;
  message?: string;
  data?: DanmakuItem[];
}
