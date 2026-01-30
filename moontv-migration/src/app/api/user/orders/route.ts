import { NextRequest, NextResponse } from 'next/server';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentOrder } from '@/lib/types';

export const runtime = 'nodejs';

// 获取用户订单列表
export async function GET(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const orders = await db.getOrdersByUser(authInfo.username);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return NextResponse.json({ error: '获取订单列表失败' }, { status: 500 });
  }
}

// 创建新订单
export async function POST(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { planId, paymentMethod, paymentProof } = body;

    if (!planId) {
      return NextResponse.json({ error: '缺少套餐ID' }, { status: 400 });
    }

    // 获取套餐信息
    const plan = await db.getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: '套餐不存在' }, { status: 404 });
    }

    if (!plan.is_active) {
      return NextResponse.json({ error: '套餐已下架' }, { status: 400 });
    }

    // 创建订单对象
    const order: PaymentOrder = {
      order_no: '', // 由数据库层生成
      username: authInfo.username,
      order_type: 'subscription',
      related_id: planId,
      amount: plan.price,
      payment_method: paymentMethod || 'alipay_qr',
      payment_status: 'pending',
      payment_proof: paymentProof || '',
      created_at: new Date().toISOString(),
    };

    const orderNo = await db.createOrder(order);

    // 发送邮件通知（异步执行，不阻塞响应）
    // 注意：在 Vercel/Netlify 等 Serverless 环境中，建议使用 await 或waitUntil
    // 这里为了响应速度，先不 await，但在 Edge Runtime 可能有问题，暂时这样
    try {
      // 动态导入 email 模块以避免构建时缺少依赖报错 (如果是 Edge Runtime)
      // 但这里是 NodeJS Runtime 应该没事
      const { sendOrderNotification } = await import('@/lib/email');
      order.order_no = orderNo; // 确保订单号存在
      await sendOrderNotification(order);
    } catch (e) {
      console.error('Failed to trigger email notification:', e);
    }

    return NextResponse.json({
      success: true,
      orderNo: orderNo,
      amount: plan.price,
      message: '订单提交成功，请等待管理员审核',
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json({ error: '创建订单失败' }, { status: 500 });
  }
}
