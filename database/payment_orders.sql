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
