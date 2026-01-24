-- D1 数据库初始化脚本
-- 为 MoonTV 应用创建所有必要的表结构

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  banned BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建播放记录表
CREATE TABLE IF NOT EXISTS play_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  year TEXT,
  cover TEXT,
  episode_index INTEGER,
  total_episodes INTEGER,
  play_time INTEGER,
  total_time INTEGER,
  save_time INTEGER,
  search_title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, source, video_id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  year TEXT,
  cover TEXT,
  total_episodes INTEGER,
  save_time INTEGER,
  search_title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, source, video_id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  keyword TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, keyword),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建跳过片头片尾配置表
CREATE TABLE IF NOT EXISTS skip_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  video_id TEXT NOT NULL,
  enable BOOLEAN DEFAULT false,
  intro_time INTEGER DEFAULT 0,
  outro_time INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, source, video_id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 创建管理员配置表
CREATE TABLE IF NOT EXISTS admin_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  config TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 输出成功信息
SELECT '✅ D1 数据库表结构创建完成' as status;

-- 显示创建的表列表
SELECT '📋 创建的数据库表:' as info;
SELECT '  • users - 用户表' as table_info;
SELECT '  • play_records - 播放记录表' as table_info;
SELECT '  • favorites - 收藏表' as table_info;
SELECT '  • search_history - 搜索历史表' as table_info;
SELECT '  • skip_configs - 跳过片头片尾配置表' as table_info;
SELECT '  • admin_config - 管理员配置表' as table_info;
SELECT '  • source_configs - 源配置表' as table_info;
SELECT '  • custom_categories - 自定义分类表' as table_info;-- 会员订阅套餐表
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                    -- 套餐名称（如：月度会员、年度会员）
  description TEXT,                       -- 套餐描述
  duration_days INTEGER NOT NULL,         -- 有效期天数
  price REAL NOT NULL,                    -- 价格
  original_price REAL,                    -- 原价（用于显示折扣）
  features TEXT,                          -- JSON格式的特权列表
  is_active BOOLEAN DEFAULT true,         -- 是否启用
  sort_order INTEGER DEFAULT 0,           -- 排序
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认套餐配置
INSERT INTO subscription_plans (name, description, duration_days, price, original_price, features, sort_order) VALUES 
('月度会员', '一个月无限观看', 30, 5.00, 10.00, '["无限观看VIP内容", "专属VIP标识", "优先客服支持"]', 1),
('季度会员', '三个月超值特惠', 90, 12.00, 30.00, '["无限观看VIP内容", "专属VIP标识", "优先客服支持"]', 2),
('年度会员', '全年畅享，每天不到2毛钱', 365, 50.00, 120.00, '["无限观看VIP内容", "专属VIP标识", "优先客服支持", "年度专属挂件"]', 3);
-- 用户订阅记录表
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active',           -- active, expired, cancelled
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
);

-- 创建索引以加速查询
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
-- 支付订单表
CREATE TABLE IF NOT EXISTS payment_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,          -- 订单号
  user_id INTEGER NOT NULL,
  order_type TEXT NOT NULL,               -- subscription, credits
  related_id INTEGER,                     -- 关联ID（套餐ID）
  amount REAL NOT NULL,                   -- 金额
  payment_method TEXT DEFAULT 'alipay_qr',-- alipay_qr（支付宝收款码）
  payment_status TEXT DEFAULT 'pending',  -- pending(待审核), approved(已通过), rejected(已拒绝), expired(已过期)
  payment_proof TEXT,                     -- 支付凭证图片路径
  verified_by INTEGER,                    -- 审核管理员ID
  verified_at DATETIME,                   -- 审核时间
  reject_reason TEXT,                     -- 拒绝原因
  paid_at DATETIME,                       -- 用户提交凭证时间
  expires_at DATETIME,                    -- 订单过期时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (verified_by) REFERENCES users (id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_no ON payment_orders(order_no);
-- 支付设置表
CREATE TABLE IF NOT EXISTS payment_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  alipay_qr_code TEXT,                    -- 支付宝收款码图片URL或base64
  alipay_account_name TEXT,               -- 收款账户名称
  payment_notice TEXT,                    -- 支付提示信息
  auto_approval BOOLEAN DEFAULT false,    -- 是否自动审核（实验性）
  order_expire_hours INTEGER DEFAULT 24,  -- 订单过期时间（小时）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始化默认设置
INSERT OR IGNORE INTO payment_settings (id, payment_notice, order_expire_hours) 
VALUES (1, '请扫描上方二维码支付，支付后请上传截图，管理员将在24小时内审核。', 24);
