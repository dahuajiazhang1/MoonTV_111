-- 会员订阅套餐表
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
