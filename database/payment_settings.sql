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
