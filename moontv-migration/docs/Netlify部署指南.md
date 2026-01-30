# MoonTV Netlify 部署完整指南

> ⭐ **原作者推荐方案** - 本指南基于原开发者在 README 中的推荐配置

---

## 📋 目录

- [为什么选择 Netlify](#为什么选择-netlify)
- [部署前准备](#部署前准备)
- [基础部署（免费版）](#基础部署免费版)
- [Upstash Redis 升级（推荐）](#upstash-redis-升级推荐)
- [会员订阅功能配置](#会员订阅功能配置)
- [自定义配置](#自定义配置)
- [域名绑定](#域名绑定)
- [监控与维护](#监控与维护)
- [常见问题](#常见问题)

---

## 🎯 为什么选择 Netlify

### ✅ 原作者推荐理由

根据 [README.md](../README.md#netlify-部署推荐) 第 54 行，**Netlify** 是原开发者明确标注的**推荐部署方案**。

### 优势对比

| 特性           | Netlify   | Cloudflare Pages      | Vercel  |
| -------------- | --------- | --------------------- | ------- |
| **原作者推荐** | ✅ **是** | ❌ 否                 | ❌ 否   |
| 账号封禁风险   | 🟢 低     | 🔴 高（视频内容敏感） | 🟡 中等 |
| 免费额度       | 🟢 充足   | 🟢 充足               | 🟡 有限 |
| 部署速度       | 🟢 快     | 🟢 快                 | 🟢 快   |
| 数据库支持     | Upstash   | D1                    | Upstash |
| 国内访问速度   | 🟡 中等   | 🟢 快                 | 🟡 中等 |
| **月度成本**   | **$0**    | $0                    | $0      |

> [!IMPORTANT]
> Cloudflare Pages 对视频聚合网站和会员付费功能管控严格，**存在封号风险**。Netlify 政策相对宽松。

---

## 🛠️ 部署前准备

### 1. GitHub 账号

- 注册 [GitHub](https://github.com)（如已有可跳过）
- Fork 本项目到你的账号

### 2. Netlify 账号

- 访问 [Netlify](https://www.netlify.com/)
- 使用 GitHub 账号登录（推荐）

### 3. 准备环境变量

至少需要设置以下密码：

```bash
PASSWORD=your_strong_password_here
```

> [!WARNING] > **安全提醒**：请务必设置强密码，避免公开访问导致的法律风险。

---

## 🚀 基础部署（免费版）

### 第一步：Fork 仓库

1. 访问 [MoonTV GitHub](https://github.com/stardm0/MoonTV)
2. 点击右上角 **Fork**
3. 等待 Fork 完成

### 第二步：导入到 Netlify

1. 登录 [Netlify](https://app.netlify.com/)
2. 点击 **Add new site → Import an existing project**
3. 授权 GitHub 访问权限
4. 选择刚才 Fork 的 `MoonTV` 仓库

### 第三步：配置构建设置

Netlify 会自动检测 Next.js 项目，保持以下默认设置：

```yaml
Build command: npm run build # 自动检测
Publish directory: .next # 自动检测
```

> [!NOTE]
> Netlify 原生支持 Next.js，无需手动配置构建命令。

### 第四步：设置环境变量

在部署前，点击 **Show advanced → New variable**：

| 变量名     | 值                  | 说明               |
| ---------- | ------------------- | ------------------ |
| `PASSWORD` | `your_password_123` | 管理员密码（必填） |

> [!TIP]
> 首次部署建议只设置 `PASSWORD`，其他变量可以后续添加。

### 第五步：部署

1. 点击 **Deploy site**
2. 等待 3-5 分钟（首次构建较慢）
3. 部署成功后会显示访问地址，格式：`https://random-name-123456.netlify.app`

### 第六步：验证部署

1. 访问分配的域名
2. 测试登录功能（使用设置的 `PASSWORD`）
3. 进入 `/admin` 管理后台

---

## 🔄 Upstash Redis 升级（推荐）

**为什么需要升级？**

- ✅ 多端数据同步（手机、电脑、平板共享收藏和观看记录）
- ✅ 支持会员订阅功能
- ✅ 支持用户注册和管理
- ❌ localstorage 仅支持单设备，刷新浏览器数据会丢失

### 第一步：创建 Upstash 数据库

1. 访问 [Upstash](https://upstash.com/)
2. 使用 GitHub 或邮箱注册
3. 点击 **Create Database**
4. 配置数据库：
   ```
   Name: moontv-db        # 任意名称
   Type: Regional         # 免费版
   Region: 选择离你最近的区域（如 Singapore）
   ```
5. 点击 **Create**

### 第二步：获取连接信息

在数据库详情页，找到以下信息：

```bash
UPSTASH_URL=https://your-db-12345.upstash.io    # REST API 端点
UPSTASH_TOKEN=AXXXXxxxxxxxxxxxxxXXXXX          # REST API Token
```

> [!CAUTION] > **请勿泄露 TOKEN**，这相当于数据库密码！

### 第三步：配置 Netlify 环境变量

1. 进入你的 Netlify 项目
2. **Site configuration → Environment variables**
3. 点击 **Add a variable**，添加以下变量：

| 变量名                     | 值                           | 来源            |
| -------------------------- | ---------------------------- | --------------- |
| `NEXT_PUBLIC_STORAGE_TYPE` | `upstash`                    | 固定值          |
| `UPSTASH_URL`              | `https://your-db.upstash.io` | 从 Upstash 复制 |
| `UPSTASH_TOKEN`            | `AXXXxxx...`                 | 从 Upstash 复制 |
| `USERNAME`                 | `admin`                      | 管理员用户名    |
| `PASSWORD`                 | `your_admin_password`        | 管理员密码      |

### 第四步：重新部署

1. 在 Netlify 项目页面，点击 **Deploys**
2. 点击 **Trigger deploy → Deploy site**
3. 等待重新构建完成（约 2-3 分钟）

### 第五步：验证 Redis 连接

1. 访问网站，使用 `USERNAME` 和 `PASSWORD` 登录
2. 添加收藏或观看视频
3. 返回 Upstash 控制台，点击 **Data Browser**
4. 应该能看到新增的 key（如 `favorites:*`, `play_records:*`）

---

## 💳 会员订阅功能配置

> [!NOTE]
> 会员功能需要先启用 Upstash Redis 存储。

### 第一步：初始化数据库表

会员功能需要以下数据表（Upstash Redis 会自动创建）：

- `subscription_plans` - 订阅套餐
- `user_subscriptions` - 用户订阅
- `payment_orders` - 支付订单
- `payment_settings` - 支付设置

> [!TIP]
> 使用 Redis 时，这些表结构是通过 Hash 数据结构模拟的，无需手动初始化 SQL。

### 第二步：访问管理后台

1. 访问 `https://your-site.netlify.app/admin`
2. 使用管理员账号登录
3. 找到 **"会员订阅管理"** 标签页

### 第三步：配置订阅套餐

在 **"订阅套餐"** 子标签：

1. 点击 **"添加/编辑套餐"**
2. 填写套餐信息：
   ```
   套餐名称: VIP月卡
   套餐描述: 30天无限观看
   时长（天）: 30
   价格: 29
   原价: 49
   功能列表: ["高清播放", "无广告", "优先加载"]
   ```
3. 点击 **"保存"**
4. 创建多个套餐（如季卡、年卡）

### 第四步：配置支付设置

在 **"支付设置"** 子标签：

1. 上传支付宝收款二维码（PNG/JPG）
2. 填写收款账户名
3. 设置支付说明：
   ```
   支付后请截图上传支付凭证，管理员将在24小时内审核开通。
   ```
4. 配置自动审核（可选）：
   - 关闭：需要管理员手动审核每笔订单
   - 开启：小额订单自动通过（不推荐）
5. 设置订单过期时间（如 24 小时）
6. 点击 **"保存设置"**

### 第五步：测试订单流程

1. 退出管理员账号
2. 注册一个测试用户（需要先开启注册）
3. 浏览订阅套餐并下单
4. 上传支付凭证截图
5. 使用管理员账号审核订单

### 开启用户注册（可选）

如果需要允许用户注册：

1. 在 Netlify 添加环境变量：
   ```
   NEXT_PUBLIC_ENABLE_REGISTER=true
   ```
2. 重新部署
3. 登录页会显示"注册"按钮

> [!WARNING]
> 开启公网注册会增加管理负担和法律风险，建议使用邀请码或白名单机制。

---

## ⚙️ 自定义配置

### 修改站点名称

```bash
# 添加环境变量
NEXT_PUBLIC_SITE_NAME=我的影视站
```

### 修改公告内容

```bash
ANNOUNCEMENT=本站仅供学习交流使用，请勿用于商业用途。
```

### 配置视频源

如果使用 localstorage 模式，需要编辑 `config.json`：

```json
{
  "api_site": {
    "your_site_key": {
      "api": "https://api.example.com/api.php/provide/vod",
      "name": "示例资源站",
      "detail": "https://api.example.com"
    }
  }
}
```

> [!NOTE]
> 使用 Upstash 后，配置在管理后台的 `/admin` 页面修改，无需编辑文件。

### 完整环境变量列表

参考 [README 环境变量章节](../README.md#环境变量) 获取完整配置项。

---

## 🌐 域名绑定

### 使用自定义域名

1. 在 Netlify 项目页面，点击 **Domain settings**
2. 点击 **Add custom domain**
3. 输入你的域名，如 `moontv.example.com`
4. 根据提示添加 DNS 记录：

   **方式一：CNAME（推荐）**

   ```
   类型: CNAME
   名称: moontv
   值: random-name-123456.netlify.app
   ```

   **方式二：A 记录**

   ```
   类型: A
   名称: @
   值: 75.2.60.5  # Netlify 负载均衡 IP
   ```

5. 等待 DNS 生效（通常 5-30 分钟）
6. Netlify 会自动配置 HTTPS 证书（Let's Encrypt）

### 使用 Netlify 子域名

免费提供 `.netlify.app` 域名，可以在 **Domain settings → Options** 中自定义：

```
原始: random-name-123456.netlify.app
自定义: moontv.netlify.app
```

---

## 📊 监控与维护

### 查看部署日志

1. **Deploys** 标签 → 点击任意部署
2. 查看构建日志排查错误
3. 常见错误：
   - `Build exceeded maximum allowed runtime`：构建超时，检查依赖
   - `Module not found`：依赖缺失，检查 `package.json`

### 查看函数日志

1. **Functions** 标签
2. 选择具体 API 函数
3. 查看调用日志和错误

### 性能监控

Netlify 免费提供：

- 📈 带宽使用统计
- 🔢 构建次数统计
- ⚡ 函数调用次数
- 📦 构建时间分析

访问 **Site analytics** 查看详细数据。

### 自动部署

每次推送到 GitHub `main` 分支会自动触发部署：

1. 修改代码或配置文件
2. 提交并推送到 GitHub
3. Netlify 自动检测变更并重新构建
4. 约 3-5 分钟后更新生效

### 备份数据

> [!IMPORTANT]
> 使用 Upstash Redis 时，定期备份数据！

**方式一：Upstash 后台导出**

1. 进入 Upstash 控制台
2. **Data Browser → Export**
3. 下载 `.rdb` 文件

**方式二：使用 Redis CLI**

```bash
npm install -g redis-cli
redis-cli -u $UPSTASH_URL --tls SAVE
```

---

## ❓ 常见问题

### 1. 部署失败，提示 "Build failed"

**原因**：依赖安装失败或环境变量错误

**解决方案**：

1. 检查 Netlify 构建日志
2. 确认 `package.json` 中的依赖版本
3. 清除缓存重新部署：**Deploys → Options → Clear cache and retry**

### 2. 访问 `/admin` 提示 401 未授权

**原因**：环境变量 `USERNAME` 或 `PASSWORD` 未设置

**解决方案**：

1. 在 Netlify 添加环境变量 `USERNAME` 和 `PASSWORD`
2. 重新部署
3. 使用设置的用户名密码登录

### 3. 收藏和播放记录无法保存

**原因**：未配置 Upstash Redis 或配置错误

**解决方案**：

1. 确认 `NEXT_PUBLIC_STORAGE_TYPE=upstash`
2. 确认 `UPSTASH_URL` 和 `UPSTASH_TOKEN` 正确
3. 在 Upstash 控制台检查数据库状态
4. 查看浏览器控制台错误信息

### 4. 会员订阅功能无法使用

**原因**：必须使用非 localstorage 存储

**解决方案**：

1. 先完成 Upstash Redis 配置
2. 确认已重新部署
3. 使用管理员账号登录 `/admin`
4. 在"会员订阅管理"中配置套餐

### 5. 网站访问速度慢

**原因**：Netlify CDN 在国内访问速度一般

**优化方案**：

- 使用 Cloudflare CDN 加速（免费）
- 绑定自定义域名并使用 Cloudflare DNS
- 考虑使用国内 VPS 部署（Docker 方案）

### 6. 支付宝二维码无法上传

**原因**：图片过大或格式不支持

**解决方案**：

1. 压缩图片至 < 500KB
2. 使用 PNG 或 JPG 格式
3. 清除浏览器缓存后重试

### 7. 订单审核后会员未生效

**原因**：数据库写入失败或逻辑错误

**排查方法**：

1. 在 Netlify Functions 日志中查看 `/api/admin/orders` 错误
2. 确认 Upstash Redis 连接正常
3. 检查订单状态是否为 `approved`
4. 在 Upstash Data Browser 中查看 `user_subscriptions:*` 数据

### 8. 如何迁移到其他平台？

**迁移步骤**：

1. 备份 Upstash Redis 数据
2. 导出 Netlify 环境变量
3. 在新平台（如 Vercel、VPS）重新部署
4. 恢复数据库数据

---

## 📚 延伸阅读

- [MoonTV README](../README.md) - 项目完整文档
- [会员订阅功能说明](./会员订阅功能说明.md) - 会员功能详细介绍
- [实际可行性说明](./实际可行性说明.md) - 功能实现状态
- [防止账号共享方案](./防止账号共享方案.md) - 高级安全功能（未实现）

---

## 🎉 部署完成检查清单

- [ ] ✅ 网站可以正常访问
- [ ] ✅ 管理员账号可以登录 `/admin`
- [ ] ✅ 视频源配置完成，可以搜索和播放
- [ ] ✅ Upstash Redis 连接成功（如已配置）
- [ ] ✅ 收藏和播放记录可以保存
- [ ] ✅ 订阅套餐已创建
- [ ] ✅ 支付设置已配置
- [ ] ✅ 测试订单流程完整
- [ ] ✅ 自定义域名已绑定（如需要）
- [ ] ✅ HTTPS 证书已生效

---

## 💡 下一步

部署成功后，你可以：

1. **添加视频源**：在 `/admin` 配置更多资源站
2. **自定义分类**：添加个性化影视分类
3. **配置防盗链**：设置 Referer 白名单
4. **启用弹幕**：部署 [danmu_api](https://github.com/huangxd-/danmu_api) 后端
5. **实现防账号共享**：参考 [防止账号共享方案](./防止账号共享方案.md)（需要额外开发）

---

> [!NOTE]
> 本指南基于 MoonTV 项目当前版本（2026-01）编写，后续版本可能有所变化。
>
> 有问题请参考 [GitHub Issues](https://github.com/stardm0/MoonTV/issues) 或提交新 Issue。

**祝部署顺利！🚀**
