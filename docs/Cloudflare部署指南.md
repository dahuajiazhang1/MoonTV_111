# 🚀 推荐部署平台：Cloudflare Pages + D1

## 为什么选择 Cloudflare Pages？

### ✅ 最佳理由

1. **完全免费**

   - 无限带宽
   - 无限请求
   - D1 数据库免费额度：每天 100,000 次读取 + 50,000 次写入
   - 足够中小型项目使用

2. **性能优异**

   - 全球 300+ CDN 节点
   - 边缘计算（Edge Runtime）
   - 响应速度快

3. **完美适配本项目**

   - 项目已配置 `pnpm run pages:build`
   - 使用 Edge Runtime
   - D1 是原生 SQLite，完美支持

4. **开发体验好**
   - Git 推送自动部署
   - 预览环境
   - 回滚简单
   - 日志完善

---

## 🎯 部署步骤

### 第一步：安装 Wrangler CLI

```bash
# 全局安装（如果还没安装）
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

### 第二步：创建 D1 数据库

```bash
# 在项目根目录执行
cd /Volumes/OS/Users/wangbengang/Documents/moontv/MoonTV

# 创建 D1 数据库
wrangler d1 create moontv-db

# 记录输出的 database_id，类似：
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 第三步：配置 wrangler.toml

在项目根目录创建 `wrangler.toml` 文件：

```toml
name = "moontv"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "moontv-db"
database_id = "你的database_id"  # 替换为第二步获得的ID
```

### 第四步：初始化数据库表

```bash
# 依次执行4个SQL文件
wrangler d1 execute moontv-db --file=./database/subscription_plans.sql
wrangler d1 execute moontv-db --file=./database/user_subscriptions.sql
wrangler d1 execute moontv-db --file=./database/payment_orders.sql
wrangler d1 execute moontv-db --file=./database/payment_settings.sql

# 验证表是否创建成功
wrangler d1 execute moontv-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 第五步：构建项目

```bash
# 安装依赖（如果还没安装）
pnpm install

# 构建 Cloudflare Pages 版本
pnpm run pages:build
```

### 第六步：部署到 Cloudflare Pages

```bash
# 部署
npx wrangler pages deploy .vercel/output/static

# 按提示选择：
# - 项目名称：moontv (或自定义)
# - 生产分支：main
```

### 第七步：绑定 D1 数据库（重要！）

1. 访问 Cloudflare Dashboard: https://dash.cloudflare.com
2. 进入 **Workers & Pages**
3. 选择你的项目 `moontv`
4. 进入 **Settings** → **Functions**
5. 找到 **D1 database bindings**
6. 点击 **Add binding**
   - Variable name: `DB`
   - D1 database: 选择 `moontv-db`
7. 点击 **Save**

### 第八步：配置环境变量

在 Cloudflare Dashboard 中：

1. 进入项目设置
2. **Settings** → **Environment variables**
3. 添加以下变量：

```
NEXT_PUBLIC_STORAGE_TYPE = d1
USERNAME = admin
PASSWORD = 你的管理员密码
```

4. 点击 **Save**

### 第九步：重新部署使配置生效

```bash
npx wrangler pages deploy .vercel/output/static
```

### 第十步：测试

访问你的网站：`https://moontv.pages.dev` (或你的自定义域名)

测试清单：

- ✅ 能否访问首页
- ✅ 能否登录后台
- ✅ 能否看到"会员订阅管理"
- ✅ 创建套餐，保存成功
- ✅ 配置支付设置，保存成功

---

## 🌐 绑定自定义域名（可选）

### 如果有域名：

1. 在 Cloudflare Pages 项目设置中
2. **Custom domains** → **Add a custom domain**
3. 输入域名，如：`moontv.yourdomain.com`
4. 按提示添加 DNS 记录
5. 等待 SSL 证书自动配置

### 如果没有域名：

使用默认的 `.pages.dev` 域名即可，完全够用！

---

## 💰 费用预估

### Cloudflare Pages 免费额度：

- ✅ **带宽**：无限
- ✅ **请求数**：无限
- ✅ **构建次数**：每月 500 次
- ✅ **并发构建**：1 个

### D1 数据库免费额度：

- ✅ **存储**：5 GB
- ✅ **每日读取**：100,000 次
- ✅ **每日写入**：50,000 次

### 适用场景：

- ✅ 日均 1 万 PV 以下：完全免费
- ✅ 日均 5 万 PV 以下：基本免费
- ⚠️ 日均 10 万+ PV：可能需要付费（但成本很低）

---

## 🔄 日常更新流程

### 代码更新：

```bash
# 1. 修改代码
# 2. 提交到 Git
git add .
git commit -m "更新说明"
git push

# 3. 重新构建和部署
pnpm run pages:build
npx wrangler pages deploy .vercel/output/static
```

### 数据库更新（如添加新表）：

```bash
wrangler d1 execute moontv-db --file=./database/new_table.sql
```

---

## 📊 监控和维护

### 查看日志：

1. Cloudflare Dashboard
2. 进入项目
3. **Functions** → **Logs**
4. 实时查看错误和请求日志

### 数据库备份：

```bash
# 导出整个数据库
wrangler d1 export moontv-db --output=backup.sql

# 恢复数据库
wrangler d1 execute moontv-db --file=backup.sql
```

### 性能监控：

Cloudflare 提供免费的 Analytics：

- 请求数统计
- 错误率
- 响应时间
- 地理分布

---

## 🆚 对比其他平台

| 特性       | Cloudflare Pages    | Vercel              | 自己的 VPS        |
| ---------- | ------------------- | ------------------- | ----------------- |
| **价格**   | 免费                | 免费额度小          | 每月 $5-20        |
| **性能**   | 边缘计算 ⭐⭐⭐⭐⭐ | Serverless ⭐⭐⭐⭐ | 看配置 ⭐⭐⭐     |
| **CDN**    | 全球 300+ 节点      | 全球加速            | 需自己配置        |
| **数据库** | D1 原生支持         | 需外部服务          | 自己安装          |
| **部署**   | 简单                | 最简单              | 复杂              |
| **运维**   | 零运维              | 零运维              | 需要运维          |
| **适合**   | 本项目 ⭐⭐⭐⭐⭐   | 快速演示 ⭐⭐⭐     | 商业项目 ⭐⭐⭐⭐ |

---

## ❓ 常见问题

### Q: 如果项目访问量很大怎么办？

A: Cloudflare 免费版已经很够用。如果真的超了免费额度：

1. 升级到 Workers Paid ($5/月) 即可获得更高额度
2. 成本仍然很低

### Q: D1 数据库够用吗？

A: 对于会员系统完全够用：

- 5GB 存储可以存储数百万条记录
- 每日 10 万次读取对应约 3-5 万 PV
- 如果不够，可以考虑 Cloudflare R2 + Durable Objects

### Q: 如何保证数据安全？

A:

1. 定期备份数据库（每周或每天）
2. 使用 Git 版本控制代码
3. Cloudflare 有企业级的数据保护

### Q: 支持国内访问吗？

A: Cloudflare 在国内访问速度一般，如果主要面向国内用户：

1. 考虑使用国内 CDN（七牛云、又拍云等）
2. 或部署到国内平台（需备案）

### Q: 可以换平台吗？

A: 可以！项目设计是平台无关的：

- 支持 Vercel: `NEXT_PUBLIC_STORAGE_TYPE=upstash`
- 支持 VPS: `NEXT_PUBLIC_STORAGE_TYPE=redis`
- 数据可以导出导入

---

## ✅ 推荐决策

### ✅ 选择 Cloudflare Pages 如果：

- 个人项目或中小型应用
- 预算有限或想免费
- 需要全球访问
- 不想运维

### ⚠️ 选择 Vercel 如果：

- 只是快速演示
- 团队已熟悉 Vercel
- 不介意额外配置数据库

### ⚠️ 选择自己的 VPS 如果：

- 大型商业项目
- 需要完全掌控
- 已有服务器
- 有运维能力

---

## 📝 快速开始命令清单

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录
wrangler login

# 3. 创建数据库
wrangler d1 create moontv-db

# 4. 配置 wrangler.toml（手动编辑）

# 5. 初始化数据库
wrangler d1 execute moontv-db --file=./database/subscription_plans.sql
wrangler d1 execute moontv-db --file=./database/user_subscriptions.sql
wrangler d1 execute moontv-db --file=./database/payment_orders.sql
wrangler d1 execute moontv-db --file=./database/payment_settings.sql

# 6. 构建
pnpm run pages:build

# 7. 部署
npx wrangler pages deploy .vercel/output/static

# 8. 在 Dashboard 中绑定 D1 数据库（手动操作）

# 9. 访问网站测试
```

---

## 🎯 结论

**强烈推荐使用 Cloudflare Pages + D1**

理由：

1. ✅ 完全免费（免费额度充足）
2. ✅ 性能优异（边缘计算）
3. ✅ 零运维
4. ✅ 完美适配本项目
5. ✅ 扩展性好

**预计部署时间：** 30 分钟  
**月度成本：** $0（免费）  
**维护成本：** 极低

---

**文档版本：** v1.0  
**最后更新：** 2026-01-22  
**推荐指数：** ⭐⭐⭐⭐⭐
