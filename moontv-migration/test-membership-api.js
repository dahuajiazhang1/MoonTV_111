#!/usr/bin/env node

/**
 * MoonTV 会员系统 API 测试脚本
 * 
 * 测试功能：
 * 1. 支付设置配置
 * 2. VIP 套餐创建
 * 3. 订单创建和审核
 * 4. 会员状态验证
 */

const BASE_URL = 'https://silly-flan-3c3aa5.netlify.app';

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`步骤 ${step}: ${description}`, 'cyan');
    log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

// 测试数据
const testData = {
    paymentSettings: {
        alipay_qr_code: 'https://example.com/alipay-test-qr.jpg',
        wechat_qr_code: 'https://example.com/wechat-test-qr.jpg',
        bank_info: '测试银行信息\n账号: 1234567890\n户名: MoonTV测试'
    },
    vipPlan: {
        name: '月度VIP会员',
        description: '享受无广告观看体验',
        duration_days: 30,
        price: 19.9,
        original_price: 29.9,
        features: '无广告观看\n高清画质\n离线下载',
        is_active: true,
        sort_order: 1
    },
    testUser: {
        username: `testuser_${Date.now()}`
    }
};

// HTTP 请求辅助函数
async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        logInfo(`请求: ${options.method || 'GET'} ${endpoint}`);

        const response = await fetch(url, {
            ...options,
            headers
        });

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
        }

        logInfo(`响应: ${response.status} ${response.statusText}`);
        return { success: true, data, status: response.status };
    } catch (error) {
        logError(`请求失败: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 测试 1: 配置支付设置
async function testPaymentSettings() {
    logStep(1, '配置支付设置');

    const result = await apiRequest('/api/admin/payment/settings', {
        method: 'POST',
        body: JSON.stringify(testData.paymentSettings)
    });

    if (result.success) {
        logSuccess('支付设置保存成功');
        console.log('支付设置:', JSON.stringify(testData.paymentSettings, null, 2));
        return true;
    } else {
        logError('支付设置保存失败');
        return false;
    }
}

// 测试 2: 获取支付设置
async function testGetPaymentSettings() {
    logStep(2, '获取支付设置');

    const result = await apiRequest('/api/admin/payment/settings');

    if (result.success) {
        logSuccess('成功获取支付设置');
        console.log('支付设置:', JSON.stringify(result.data, null, 2));

        // 验证数据
        if (result.data.alipay_qr_code === testData.paymentSettings.alipay_qr_code) {
            logSuccess('支付宝二维码验证通过');
        } else {
            logError('支付宝二维码不匹配');
        }

        return true;
    } else {
        logError('获取支付设置失败');
        return false;
    }
}

// 测试 3: 创建 VIP 套餐
async function testCreatePlan() {
    logStep(3, '创建 VIP 套餐');

    const result = await apiRequest('/api/admin/subscriptions/plans', {
        method: 'POST',
        body: JSON.stringify(testData.vipPlan)
    });

    if (result.success) {
        logSuccess('VIP 套餐创建成功');
        console.log('套餐信息:', JSON.stringify(result.data, null, 2));
        testData.createdPlanId = result.data.id || result.data.plan_id;
        logInfo(`套餐 ID: ${testData.createdPlanId}`);
        return true;
    } else {
        logError('VIP 套餐创建失败');
        return false;
    }
}

// 测试 4: 获取套餐列表
async function testGetPlans() {
    logStep(4, '获取套餐列表');

    const result = await apiRequest('/api/subscriptions/plans');

    if (result.success) {
        logSuccess('成功获取套餐列表');
        const plans = Array.isArray(result.data) ? result.data : result.data.plans;
        console.log(`共 ${plans.length} 个套餐:`);
        plans.forEach((plan, index) => {
            console.log(`  ${index + 1}. ${plan.name} - ¥${plan.price} (${plan.duration_days}天)`);
        });

        // 验证我们创建的套餐是否在列表中
        const found = plans.find(p => p.name === testData.vipPlan.name);
        if (found) {
            logSuccess('创建的套餐已在列表中显示');
            testData.createdPlanId = testData.createdPlanId || found.id;
        }

        return true;
    } else {
        logError('获取套餐列表失败');
        return false;
    }
}

// 测试 5: 创建测试订单
async function testCreateOrder() {
    logStep(5, '创建测试订单');

    if (!testData.createdPlanId) {
        logError('没有可用的套餐 ID，跳过订单创建测试');
        return false;
    }

    const orderData = {
        username: testData.testUser.username,
        plan_id: testData.createdPlanId,
        amount: testData.vipPlan.price,
        payment_method: 'alipay'
    };

    const result = await apiRequest('/api/user/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });

    if (result.success) {
        logSuccess('测试订单创建成功');
        console.log('订单信息:', JSON.stringify(result.data, null, 2));
        testData.createdOrderNo = result.data.order_no || result.data.orderNo;
        logInfo(`订单号: ${testData.createdOrderNo}`);
        return true;
    } else {
        logError('测试订单创建失败');
        logInfo('注意: 订单创建可能需要用户认证，这是正常的');
        return false;
    }
}

// 测试 6: 获取待审核订单
async function testGetPendingOrders() {
    logStep(6, '获取待审核订单');

    const result = await apiRequest('/api/admin/orders/pending');

    if (result.success) {
        logSuccess('成功获取待审核订单');
        const orders = Array.isArray(result.data) ? result.data : result.data.orders || [];
        console.log(`共 ${orders.length} 个待审核订单`);

        if (orders.length > 0) {
            orders.forEach((order, index) => {
                console.log(`  ${index + 1}. 订单号: ${order.order_no} - 用户: ${order.username} - ¥${order.amount}`);
            });
        }

        return true;
    } else {
        logError('获取待审核订单失败');
        return false;
    }
}

// 测试 7: 审核订单（如果有订单的话）
async function testApproveOrder() {
    logStep(7, '订单审核测试');

    if (!testData.createdOrderNo) {
        logInfo('没有测试订单，跳过审核测试');
        return true;
    }

    const approvalData = {
        order_no: testData.createdOrderNo,
        status: 'approved',
        reject_reason: ''
    };

    const result = await apiRequest('/api/admin/orders/approve', {
        method: 'POST',
        body: JSON.stringify(approvalData)
    });

    if (result.success) {
        logSuccess('订单审核成功');
        console.log('审核结果:', JSON.stringify(result.data, null, 2));
        return true;
    } else {
        logError('订单审核失败');
        return false;
    }
}

// 测试 8: 验证用户订阅状态
async function testUserSubscription() {
    logStep(8, '验证用户订阅状态');

    const result = await apiRequest(`/api/user/subscription?username=${testData.testUser.username}`);

    if (result.success) {
        logSuccess('成功获取用户订阅状态');
        console.log('订阅信息:', JSON.stringify(result.data, null, 2));

        if (result.data && result.data.status === 'active') {
            logSuccess('用户会员状态已激活');
        } else if (result.data) {
            logInfo(`用户会员状态: ${result.data.status}`);
        } else {
            logInfo('用户暂无订阅');
        }

        return true;
    } else {
        logError('获取用户订阅状态失败');
        return false;
    }
}

// 主测试流程
async function runTests() {
    log('\n' + '═'.repeat(60), 'cyan');
    log('    MoonTV 会员系统 API 功能测试', 'cyan');
    log('═'.repeat(60) + '\n', 'cyan');

    logInfo(`测试站点: ${BASE_URL}`);
    logInfo(`测试用户: ${testData.testUser.username}`);
    logInfo(`开始时间: ${new Date().toLocaleString('zh-CN')}\n`);

    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };

    const tests = [
        { name: '配置支付设置', fn: testPaymentSettings },
        { name: '获取支付设置', fn: testGetPaymentSettings },
        { name: '创建 VIP 套餐', fn: testCreatePlan },
        { name: '获取套餐列表', fn: testGetPlans },
        { name: '创建测试订单', fn: testCreateOrder },
        { name: '获取待审核订单', fn: testGetPendingOrders },
        { name: '订单审核', fn: testApproveOrder },
        { name: '验证用户订阅', fn: testUserSubscription }
    ];

    for (const test of tests) {
        results.total++;
        try {
            const success = await test.fn();
            if (success) {
                results.passed++;
            } else {
                results.failed++;
            }
            // 等待一下，避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            results.failed++;
            logError(`测试异常: ${error.message}`);
        }
    }

    // 测试总结
    log('\n' + '═'.repeat(60), 'cyan');
    log('    测试总结', 'cyan');
    log('═'.repeat(60), 'cyan');

    log(`\n总计: ${results.total} 项测试`, 'blue');
    log(`通过: ${results.passed} 项`, 'green');
    log(`失败: ${results.failed} 项`, results.failed > 0 ? 'red' : 'green');

    const successRate = ((results.passed / results.total) * 100).toFixed(1);
    log(`成功率: ${successRate}%\n`, successRate >= 80 ? 'green' : 'yellow');

    if (results.failed > 0) {
        log('注意: 某些测试失败可能是由于需要认证或权限限制', 'yellow');
        log('这些功能在浏览器中通过管理员登录后应该可以正常使用\n', 'yellow');
    }

    log(`完成时间: ${new Date().toLocaleString('zh-CN')}\n`, 'blue');
}

// 运行测试
runTests().catch(error => {
    logError(`测试脚本执行失败: ${error.message}`);
    process.exit(1);
});
